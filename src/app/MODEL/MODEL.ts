export interface Tab {
  id: string;
  label: string;
  component: any;
}

export interface PaginationFilter {
  startDate: string | null;
  endDate: string | null;
  searchTerm: string;
  pageNo: number;
  pageSize: number;
}

export interface ProductCategory {
  categoryName: string;       // required
  description?: string;       // optional
  createdBy?: number;         // optional
}

export interface WarehouseModel {
  warehouseName: string;
  isRefrigerated: boolean;
  remark?: string; // optional, since it can be NULL
}


export interface ProductModel {
  productName: string;
  productCategory: number;
  productType?: string | null;
  packedDate?: Date | null;
  packedWeight?: number | null;
  packedHeight?: number | null;
  packedDepth?: number | null;
  packedWidth?: number | null;
  isPerishable?: boolean | null;
  purchasePrice?: number | null;
  sellingPrice?: number | null;
  taxRate?: number | null;
  discount?: number | null;
  productDescription: string;
  reorderQuantity: number;
  warehouseID: number;
  warehouseName: string;
  warehouseRefrigerated: boolean;
  productQunatity?: number | null;
   taxpr: number,
  discounpr: number,
}

export interface Customer {
  customerName: string;
  customerAddress: string;
  phoneNo: string;
  email: string;
  paymentMode?: number; // nullable
  remark?: string;

   paidAmt?: number;           // @paid_amt
  balanceDue?: number;        // @balance_due
  totalAmt?: number;          // @total_amt
  transactionType?: string;   // @transaction_type
}

export interface SaleDetail {
  productID: number;
  createdBy?: number; // nullable
  productquantity?: number; // nullable
}

export interface Sale {
  customerID?: number; // nullable if new customer
  customer?: Customer; // optional
  totalItems: number;
  totalAmount: number;
  totalDiscount: number;
  orderDate?: Date; // nullable
  saleDetails: SaleDetail[];
}

export interface ProviderModel {
  providerName: string;
  providerType: string;
  contactPerson?: string;
  contactEmail: string;
  contactPhone: string;
  providerAddress: string;
  city: string;
  state: string;
  country: string;
  paymentTerms?: string;
}

export interface cart {
  productID: number;
  name: string;
  qty: number;
  total: number;
  weight: number;
  discountAmt: number;
  taxAmt: number;
  sellingPrice: number;
}


export interface generateReceiptpdf {
   barcode: string;
   customer?: Customer; // optional
   cart: cart[];

}

export interface UpdateCompanyInfo
{
    company_Name?: string;
    contact_No?: string;
    whatsApp_No?: string;
    email?: string;
    address?: string;
    row_id?: number;
    file?: File | null;  // <-- this will now receive uploaded file
}

export interface CustomerLedgerModel {
  paidamount?: number;        // decimal? → optional number
  balancedue?: number;        // decimal? → optional number
  totalamount: number;        // decimal → number (required)
  paymentmode: number;        // int → number (required)
  transactiontype?: string;   // string? → optional string
  createby: number;           // int → number (required)
}

export interface CartItemDTO {
  productID: number;       // Product unique ID
  name: string;            // Product name
  qty: number;             // Quantity
  total: number;           // Total price after discount & tax
  weight: number;          // Weight of the product (kg, g, etc.)
  discountAmt: number;     // Discount amount applied
  taxAmt: number;          // Tax amount applied
  sellingPrice: number;    // Selling price per unit
}
