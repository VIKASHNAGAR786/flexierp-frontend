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
