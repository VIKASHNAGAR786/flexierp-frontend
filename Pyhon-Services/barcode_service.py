# barcode_service.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import barcode
from barcode.writer import ImageWriter
import base64
from io import BytesIO

app = FastAPI()

@app.get("/barcode/{text}")
def generate_barcode(text: str):
    ean = barcode.get("code128", text, writer=ImageWriter())
    buffer = BytesIO()
    ean.write(buffer)
    encoded = base64.b64encode(buffer.getvalue()).decode()
    return JSONResponse(content={"barcode": encoded})
