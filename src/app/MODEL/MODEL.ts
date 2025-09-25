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
}

export interface Customer {
  customerName: string;
  customerAddress: string;
  phoneNo: string;
  email: string;
  paymentMode?: number; // nullable
}

export interface SaleDetail {
  productID: number;
  createdBy?: number; // nullable
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

