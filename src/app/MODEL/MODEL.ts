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

