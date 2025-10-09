# barcode_service.py
from fastapi import FastAPI, HTTPException, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import barcode
from barcode.writer import ImageWriter
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from PIL import Image
import datetime
from reportlab.lib.utils import ImageReader
from models import GenerateReceiptPDF  # Your Pydantic models
import os
import sys
from io import BytesIO
from fpdf import FPDF # fpdf2


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

@app.get("/barcode/png/{text}")
def generate_barcode_png(
    text: str,
    barcode_type: str = Query("code128"),
    module_width: float = Query(0.2),
    module_height: float = Query(15.0)
):
    try:
        barcode_type = barcode_type.lower()
        if barcode_type not in SUPPORTED_BARCODES:
            raise HTTPException(status_code=400, detail=f"Unsupported barcode type")
        
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

@app.post("/generate-receipt")
async def generate_receipt(data: GenerateReceiptPDF):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # Generate barcode image
    barcode_class = barcode.get_barcode_class('code128')
    barcode_img_buffer = BytesIO()
    ean = barcode_class(data.barcode, writer=ImageWriter())
    ean.write(barcode_img_buffer)
    barcode_img_buffer.seek(0)
    barcode_img = Image.open(barcode_img_buffer)
    barcode_reader = ImageReader(barcode_img)

    # Company Info
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, height - 40, "🏢 My Company Pvt. Ltd.")
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, height - 55, "123, Main Street, City, Country")
    pdf.drawString(50, height - 70, "Phone: +91 1234567890 | Email: info@mycompany.com")

    # Header
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, height - 100, "🧾 Invoice / Receipt")
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, height - 120, f"Invoice No: {data.barcode}")
    pdf.drawString(300, height - 120, f"Date: {datetime.datetime.now().strftime('%d-%m-%Y %H:%M')}")

    # Draw Barcode
    pdf.drawImage(barcode_reader, 400, height - 150, width=150, height=50)

    # Customer Details
    y = height - 200
    if data.customer:
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Customer Information")
        pdf.setFont("Helvetica", 10)
        y -= 20
        pdf.drawString(60, y, f"Name: {data.customer.customerName}")
        y -= 15
        pdf.drawString(60, y, f"Address: {data.customer.customerAddress}")
        y -= 15
        pdf.drawString(60, y, f"Phone: {data.customer.phoneNo}")
        y -= 15
        pdf.drawString(60, y, f"Email: {data.customer.email}")
        y -= 15
        if data.customer.paymentMode is not None:
            pdf.drawString(60, y, f"Payment Mode: {data.customer.paymentMode}")
            y -= 15
        if data.customer.remark:
            pdf.drawString(60, y, f"Remark: {data.customer.remark}")
            y -= 15

    # Cart Table
    y -= 20
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(50, y, "Product")
    pdf.drawString(200, y, "Qty")
    pdf.drawString(250, y, "Price")
    pdf.drawString(320, y, "Discount")
    pdf.drawString(400, y, "Tax")
    pdf.drawString(470, y, "Total")
    y -= 10
    pdf.line(50, y, 550, y)

    # Cart Items
    pdf.setFont("Helvetica", 10)
    grand_total = 0
    for item in data.cart:
        y -= 20
        if y < 100:
            pdf.showPage()
            y = height - 100
        pdf.drawString(50, y, item.name)
        pdf.drawString(200, y, str(item.qty))
        pdf.drawString(250, y, f"{item.sellingPrice:.2f}")
        pdf.drawString(320, y, f"{item.discountAmt:.2f}")
        pdf.drawString(400, y, f"{item.taxAmt:.2f}")
        pdf.drawString(470, y, f"{item.total:.2f}")
        grand_total += item.total

    # Grand Total
    y -= 30
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(400, y, "Grand Total:")
    pdf.drawString(500, y, f"{grand_total:.2f}")

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    return Response(
        buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=invoice_{data.barcode}.pdf"}
    )

@app.post("/barcode/pdf")
def generate_barcode_pdf(barcodes: list[str]):
    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("helvetica", size=12)

        x, y = 10, 10
        for code in barcodes:
            ean = barcode.get("code128", code, writer=ImageWriter())
            ean.writer.set_options({
                "font_path": font_path,   # 👈 ensures font exists even in .exe
                "font_size": 10,
                "text_distance": 1.0,
            })

            buffer = BytesIO()
            ean.write(buffer)
            buffer.seek(0)

            img = Image.open(buffer)
            temp_img = BytesIO()
            img.save(temp_img, format="PNG")
            temp_img.seek(0)

            pdf.image(temp_img, x=x, y=y, w=50, h=20)

            y += 30
            if y > 250:
                y = 10
                pdf.add_page()

        output = BytesIO()
        pdf.output(output)
        output.seek(0)
        return StreamingResponse(output, media_type="application/pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


