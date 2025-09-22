from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import barcode
from barcode.writer import ImageWriter
from io import BytesIO
from fpdf import FPDF # fpdf2
from PIL import Image

app = FastAPI(
    title="Barcode Generator API",
    description="Generate barcodes dynamically for your products",
    version="1.1"
)

# Allow Angular frontend or other frontends to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supported barcode types
SUPPORTED_BARCODES = ["code128", "ean13", "ean8", "upc", "isbn13"]

@app.get("/barcode/png/{text}")
def generate_barcode_png(
    text: str,
    barcode_type: str = Query("code128", description="Barcode format"),
    module_width: float = Query(0.2, description="Width of barcode lines"),
    module_height: float = Query(15.0, description="Height of barcode lines")
):
    """
    Generate a barcode as PNG image.
    - `text`: The data/text to encode in barcode
    - `barcode_type`: Type of barcode (default: code128)
    - `module_width`: Width of each barcode module (default: 0.2)
    - `module_height`: Height of barcode (default: 15.0)
    """
    try:
        barcode_type = barcode_type.lower()
        if barcode_type not in SUPPORTED_BARCODES:
            raise HTTPException(status_code=400, detail=f"Unsupported barcode type. Supported: {SUPPORTED_BARCODES}")

        # Generate barcode
        barcode_class = barcode.get_barcode_class(barcode_type)
        ean = barcode_class(
            text, 
            writer=ImageWriter()
        )
        
        # Customize barcode size
        ean.writer.set_options({
            "module_width": module_width,
            "module_height": module_height,
            "quiet_zone": 2.0,
            "font_size": 10,
            "text_distance": 1.0
        })

        buffer = BytesIO()
        ean.write(buffer)
        buffer.seek(0)

        return StreamingResponse(buffer, media_type="image/png")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Barcode generation failed: {str(e)}")

@app.post("/barcode/pdf")
def generate_barcode_pdf(barcodes: list[str]):
    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        x, y = 10, 10
        for code in barcodes:
            # Generate barcode in memory
            ean = barcode.get("code128", code, writer=ImageWriter())
            buffer = BytesIO()
            ean.write(buffer)
            buffer.seek(0)

            # Open with PIL
            img = Image.open(buffer)

            # Save to temporary in-memory BytesIO in PNG format
            temp_img = BytesIO()
            img.save(temp_img, format="PNG")
            temp_img.seek(0)

            # Add image to PDF
            pdf.image(temp_img, x=x, y=y, w=50, h=20)  # fpdf2 detects PIL automatically

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
# for running this service directly
# python -m uvicorn barcode_service:app --reload --host 127.0.0.1 --port 5001
