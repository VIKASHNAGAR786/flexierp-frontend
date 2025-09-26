export interface ProductCategoryDTO {
  categoryID?: number;      // optional
  categoryName?: string;    // optional
  description?: string;     // optional
}

export interface ProductDTO {
  productID: number;
  productCode: string;
  barCode: string;
  productName: string;
  categoryName: string;
  productType: string;
  packedDate: string | null; // ISO date string
  packedWeight: number | null;
  packedHeight: number | null;
  packedDepth: number | null;
  packedWidth: number | null;
  isPerishable: boolean | null;
  createdDate: string; // ISO date string
  purchasePrice: number | null;
  sellingPrice: number | null;
  taxRate: number | null;
  discount: number | null;
  fullName: string;
  totalRecords: number;
}

export interface ProductByBarcodeDTO {
  productID: number;
  productCode: string;
  barCode: string;
  productName: string;
  categoryName: string;
  productType: string;
  packedDate?: string;      // ISO date string, optional
  packedWeight?: number;
  packedHeight?: number;
  packedDepth?: number;
  packedWidth?: number;
  isPerishable?: boolean;
  purchasePrice?: number;
  sellingPrice?: number;
  taxRate?: number;
  discount?: number;
}

export interface SaleDTO {
  srNo: number;
  saleID: number;
  customerName: string;
  totalItems: number;
  totalAmount: number;
  totalDiscount: number;
  orderDate: Date;
  fullName: string;
  totalRows: number;
}

export interface OldCustomerDTO {
    srNo: number;
    customerID: number;
    customerName: string;
    phoneNo: string;
    email: string;
    remark: string;
    totalRecords: number;
}

export interface CustomerWithSalesDTO {
    srNo: number;
    customerID: number;
    customerName: string;
    customerAddress: string;
    phoneNo: string;
    email: string;
    totalItems: number;
    paymentMode: string;
    remark: string;
    createdDate: string;  // Use string if coming from API (ISO date), otherwise Date
    fullName: string;
    totalRecords: number;
}


