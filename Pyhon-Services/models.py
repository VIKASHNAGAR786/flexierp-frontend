from pydantic import BaseModel
from typing import List, Optional

class Cart(BaseModel):
    productID: int
    name: str
    qty: int
    total: float
    weight: float
    discountAmt: float
    taxAmt: float
    sellingPrice: float

class Customer(BaseModel):
    customerName: str
    customerAddress: str
    phoneNo: str
    email: str
    paymentMode: Optional[int] = None
    remark: Optional[str] = None

class GenerateReceiptPDF(BaseModel):
    barcode: str
    customer: Optional[Customer] = None
    cart: List[Cart]
