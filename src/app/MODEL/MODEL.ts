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
