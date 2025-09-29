from fastapi import FastAPI, HTTPException,Response, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import barcode
from barcode.writer import ImageWriter
from io import BytesIO
from fpdf import FPDF # fpdf2
from PIL import Image
from models import GenerateReceiptPDF
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import datetime

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
SUPPORTED_BARCODES = ["code128"]

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

@app.post("/generate-receipt")
async def generate_receipt(data: GenerateReceiptPDF):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # ----- Generate barcode image -----
    barcode_class = barcode.get_barcode_class('code128')
    barcode_img_buffer = BytesIO()
    ean = barcode_class(data.barcode, writer=ImageWriter())
    ean.write(barcode_img_buffer)
    barcode_img_buffer.seek(0)
    barcode_img = Image.open(barcode_img_buffer)

    # Convert PIL Image to ReportLab format
    from reportlab.lib.utils import ImageReader
    barcode_reader = ImageReader(barcode_img)

    # ----- Company Info (Hardcoded) -----
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

    # Draw Barcode below header
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

    # Cart Table Header
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
        if y < 100:  # New Page if space ends
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


#pip install 
# pip install fastapi uvicorn python-barcode fpdf2 pillow   
# for running this service directly
# python -m uvicorn barcode_service:app --reload --host 127.0.0.1 --port 5001
# for building executable
# python -m PyInstaller --onefile barcode_service.py
