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
  quantity?:number;
  availableQuantity?: number;
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
  extracharges?: number; // New field for extra charges
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
export interface ProviderDTO {
  srNo: number;
  providerID: number;
  providerName: string;
  providerType: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  providerAddress: string;
  city: string;
  state: string;
  country: string;
  paymentTerms: string;
  createdBy: number;
  createdDate: string;
  createdByName: string;
  totalRows: number;
}

export interface WarehouseDTO {
  warehouseID?: number;
  warehouseName?: string;
  isRefrigerated?: boolean;
  createdBy?: number;
  remark?: string;
  createdDate?: string; // Use string for date from API or Date type if you parse it
}

export interface UserLoginHistoryDTO {
  historyID: number;
  username: string;
  email: string;
  loginTime: string;
  logoutTime: string;
  status: string;
  ipAddress: string;
  deviceInfo: string;
  failureReason: string;
  totalRecords: number;
}

export interface CompanyInfoDTO {
  comInfoId: number;
  companyName: string;
  contactNo: string;
  whatsAppNo: string;
  email: string;
  address: string;
  fullName: string;
  createdDate: string;
  companyLogo: string;
}

export interface CustomerLedgerDto {
  customerid: number;
  customername?: string;
  contactNo?: string;
  email?: string;
  customerAddress?: string;
  totalamount: number;
  totaldue: number;
  lasttransactiondate?: string;
  rowid?: number;
}

export interface CustomerLedgerDetailDto {
  customerid: number;
  paidamt: number;
  transactiontype?: string;
  totalamount: number;
  balancedue: number;
  transactiondate?: string;
  saledate?: string;
  totalitems: number;
  totaldiscount: number;
  paymentmode: number;
  rowid?: number;
  tax?: number;
  customername: string;
  contactno: string;
}

export interface DashboardMetricsDto
 {
     TotalCashReceived : number,
     TotalChequeReceived : number,
     CashGrowthPercent : number,
     ChequeGrowthPercent : number,
     totalBalanceDue : number,
     recenttransaction: TransactionDto[],
 }

 export interface TransactionDto {
  date: string;
  time: string;
  customerName: string;
  receivedAmount: number;
  balanceDue: number;
  totalAmount: number;
  paymentType: string;
  transactionType: string;
}

     export interface ProductCategoryListDto
    {
        srNo: number;
        categoryName: string;
        description: string;
        createdDate: Date;
    }

    export interface ReceivedChequeDto {
  srNo: number;
  customerName: string;
  customerAddress: string;
  phoneNo: string;
  chequeNumber: string;
  bankName: string;
  branchName: string;
  chequeDate: string;
  amount: number;
  ifsc_Code: string;
  createdAt: string;
  fullName: string;
  totalRecords: number;
}
