# barcode_service.py
import math
from fastapi import FastAPI, HTTPException, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import barcode
from barcode.writer import ImageWriter
from io import BytesIO
from reportlab.lib.pagesizes import A4
from PIL import Image
import os
import sys
from io import BytesIO
from fpdf import FPDF # fpdf2
import tempfile
from typing import List, Dict


app = FastAPI(
    title="Barcode Generator API",
    description="Generate barcodes dynamically for your products",
    version="1.1"
)

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_BARCODES = ["code128"]

if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.dirname(__file__)

font_path = os.path.join(base_path, "fonts", "DejaVuSans.ttf")

SUPPORTED_BARCODES = ["code128", "ean13"]

if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.dirname(__file__)

font_path = os.path.join(base_path, "fonts", "DejaVuSans.ttf")

@app.get("/barcode/png/{text}")
def generate_barcode_png(
    text: str,
    barcode_type: str = Query("ean13"),   # default to EAN-13 now
    module_width: float = Query(0.2),
    module_height: float = Query(15.0)
):
    try:
        barcode_type = barcode_type.lower()
        if barcode_type not in SUPPORTED_BARCODES:
            raise HTTPException(status_code=400, detail=f"Unsupported barcode type")

        # EAN-13 requires exactly 12 digits (check digit auto-calculated)
        if barcode_type == "ean13":
            if not text.isdigit() or len(text) != 12:
                raise HTTPException(
                    status_code=400,
                    detail="EAN-13 requires a 12-digit numeric string"
                )

        barcode_class = barcode.get_barcode_class(barcode_type)
        ean = barcode_class(text, writer=ImageWriter())
        ean.writer.set_options({
            "module_width": module_width,
            "module_height": module_height,
            "quiet_zone": 2.0,
            "font_size": 10,
            "text_distance": 1.0,
            "font_path": font_path
        })

        buffer = BytesIO()
        ean.write(buffer)
        buffer.seek(0)

        return StreamingResponse(buffer, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Barcode generation failed: {str(e)}")
    
@app.post("/barcode/pdf")
def generate_barcode_pdf(
    barcode_items: List[Dict],
    columns: int = Query(2, ge=1, le=6),            # how many columns per row (2 is default)
    items_per_page: int = Query(8, ge=1),           # maximum barcodes allowed per page
    show_text: bool = Query(False)                  # whether to show human-readable barcode numbers
):
    """
    barcode_items: list of dicts { "code": "12345", "name": "Item name" }
    columns: number of columns (e.g. 2 -> produces 2 barcode+name pairs per row)
    items_per_page: how many barcode items on each PDF page (controls rows)
    show_text: if True prints barcode number under barcode; if False, hides it
    """

    try:
        # -- PDF / page settings --
        pdf = FPDF(orientation="P", unit="mm", format="A4")
        pdf.set_auto_page_break(auto=False)  # we'll control pages manually
        pdf.set_font("helvetica", size=10)

        margin = 10  # left/right/top margin
        page_w = pdf.w
        page_h = pdf.h
        usable_w = page_w - 2 * margin
        usable_h = page_h - 2 * margin

        # Repeatable header height (space used for header row)
        header_h = 10

        # Layout derived from columns and items_per_page
        cols = max(1, int(columns))
        ipp = max(1, int(items_per_page))
        rows_per_page = math.ceil(ipp / cols)

        # cell width and row height
        cell_w = usable_w / cols
        # leave small vertical gap between rows => compute row height to fit rows_per_page
        vert_gap = 4
        cell_h = (usable_h - header_h - (rows_per_page - 1) * vert_gap) / rows_per_page

        # inner paddings inside each cell (so barcode doesn't touch border)
        pad_x = 6
        pad_y = 6

        def draw_page_header(y0):
            pdf.set_xy(margin, y0)
            pdf.set_font("helvetica", size=11, style="B")
            # create simple header with repeated columns: Barcode | Name ...
            # we will make each cell half cell for barcode & name visualization
            half_w = cell_w / 2
            for c in range(cols):
                pdf.cell(half_w, header_h, "Barcode", border=1, ln=0, align="C")
                pdf.cell(half_w, header_h, "Name", border=1, ln=0, align="C")
            pdf.ln()
            return y0 + header_h

        # helper to generate barcode image bytes (PIL image) and return temp path
        def make_barcode_image(code_value: str, write_text: bool):
    # EAN-13 requires 12 digits input (numeric only)
            if not code_value.isdigit() or len(code_value) != 12:
                raise HTTPException(
                    status_code=400,
                    detail="EAN-13 requires a 12-digit numeric string"
                )

            ean = barcode.get("ean13", code_value, writer=ImageWriter())
            buf = BytesIO()
            ean.write(buf, {
                "write_text": write_text,
                "module_width": 0.21,
                "module_height": 12,
                "quiet_zone": 1,
            })
            buf.seek(0)
            img = Image.open(buf).convert("RGB")

            tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
            img.save(tmp, format="PNG")
            tmp.flush()
            tmp.close()
            return tmp.name, img.size
        # iterate items and place them page by page
        tmp_files_to_cleanup = []
        try:
            total = len(barcode_items)
            if total == 0:
                # Return empty pdf
                output = BytesIO()
                pdf.add_page()
                pdf.output(output)
                output.seek(0)
                return StreamingResponse(output, media_type="application/pdf")

            # We'll iterate items and create pages when needed
            index = 0
            while index < total:
                pdf.add_page()
                y_cursor = margin
                # draw header row
                y_cursor = draw_page_header(y_cursor)

                # for each page draw up to ipp items
                page_end = min(index + ipp, total)
                page_slice = barcode_items[index:page_end]

                for i_on_page, item in enumerate(page_slice):
                    code = str(item.get("code", "") or "")
                    name = str(item.get("name", "Unnamed"))

                    # compute row and column on current page
                    page_pos = i_on_page
                    row = page_pos // cols
                    col = page_pos % cols

                    # top-left of the cell
                    x_cell = margin + col * cell_w
                    y_cell = y_cursor + row * (cell_h + vert_gap)

                    # cell split: left half is barcode, right half is name (as earlier)
                    left_w = cell_w / 2
                    right_w = cell_w / 2

                    # draw cell borders for both halves (so table looks consistent)
                    pdf.set_xy(x_cell, y_cell)
                    pdf.cell(left_w, cell_h, border=1, ln=0)
                    pdf.set_xy(x_cell + left_w, y_cell)
                    pdf.cell(right_w, cell_h, border=1, ln=0)

                    # create barcode image file
                    tmp_path, (img_w_px, img_h_px) = make_barcode_image(code, write_text=show_text)
                    tmp_files_to_cleanup.append(tmp_path)

                    # Now compute desired image size in mm to fit inside left half with padding
                    # FPDF uses mm. Assume image DPI 96 if needed; better approach: keep aspect ratio using pixel ratio,
                    # we don't need DPI because FPDF scales by the width/height in mm relative to page.
                    max_img_w = left_w - 2 * pad_x
                    max_img_h = cell_h - 2 * pad_y

                    # compute image aspect ratio from PIL pixels
                    aspect = img_h_px / img_w_px if img_w_px else 1.0

                    # attempt to fit width first
                    disp_w = max_img_w
                    disp_h = disp_w * aspect
                    if disp_h > max_img_h:
                        # too tall => fit by height
                        disp_h = max_img_h
                        disp_w = disp_h / aspect

                    # center image inside left half
                    img_x_mm = x_cell + (left_w - disp_w) / 2
                    img_y_mm = y_cell + (cell_h - disp_h) / 2

                    # insert image
                    pdf.image(tmp_path, x=img_x_mm, y=img_y_mm, w=disp_w, h=disp_h)

                    # draw name centered in right half (auto-wrap if needed)
                    pdf.set_xy(x_cell + left_w, y_cell + (cell_h / 2) - 3)
                    pdf.set_font("helvetica", size=10)
                    pdf.multi_cell(right_w, 6, txt=name, border=0, align="C")
                    # continue to next item

                # move to next page
                index = page_end

        finally:
            # cleanup temp files
            for f in tmp_files_to_cleanup:
                try:
                    os.unlink(f)
                except Exception:
                    pass

        # return PDF
        output = BytesIO()
        pdf.output(output)
        output.seek(0)
        return StreamingResponse(output, media_type="application/pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))