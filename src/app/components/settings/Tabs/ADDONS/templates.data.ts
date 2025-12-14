// templates.data.ts

// 1. Define ALL template keys you'll use
export type TemplateKey = 'receipt' | 'orderreceipt' | 'purchase' | 'invoice' | 'quotation';

export interface FieldCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  fields: string[];
}

export const FIELD_CATEGORIES: FieldCategory[] = [
  {
    id: 'customer',
    name: 'Customer Details',
    icon: 'bi bi-person',
    color: 'bg-blue-100 text-blue-800',
    fields: ['CustomerName', 'PhoneNo', 'Email', 'Remark']
  },
  {
    id: 'company',
    name: 'Company Details',
    icon: 'bi bi-building',
    color: 'bg-green-100 text-green-800',
    fields: ['CompanyName', 'ContactNo', 'Address', 'CompanyEmail']
  },
  {
    id: 'invoice',
    name: 'Invoice Details',
    icon: 'bi bi-receipt',
    color: 'bg-purple-100 text-purple-800',
    fields: ['invoiceno', 'InvoiceDate', 'PaymentMode', 'TotalAmount']
  },
  {
    id: 'payment',
    name: 'Payment Details',
    icon: 'bi bi-credit-card',
    color: 'bg-yellow-100 text-yellow-800',
    fields: ['TotalDiscount', 'paidamt', 'baldue', 'TotalItems']
  },
  {
    id: 'bank',
    name: 'Bank Details',
    icon: 'bi bi-bank',
    color: 'bg-red-100 text-red-800',
    fields: ['AccountName', 'BankName', 'AccountNumber', 'IFSCCode', 'BranchName']
  },
  {
    id: 'tables',
    name: 'Tables',
    icon: 'bi bi-table',
    color: 'bg-indigo-100 text-indigo-800',
    fields: ['SaleDetailsTable', 'ExtraChargesTable']
  }
];

// 2. Define a BASE template that all templates share
const BASE_TEMPLATE_FIELDS = {
  // Customer Fields
  "Customer Name": "CustomerName",
  "Phone Number": "PhoneNo",
  "Customer Email": "Email",
  "Remark": "Remark",
  
  // Company Fields
  "Company Name": "CompanyName",
  "Contact Number": "ContactNo",
  "WhatsApp Number": "WhatsAppNo",
  "Address": "Address",
  "Full Name": "FullName",
  "Company Logo": "CompanyLogo",
  "Company Email": "CompanyEmail",
  
  // Payment Fields
  "Total Items": "TotalItems",
  "Total Amount": "TotalAmount",
  "Total Discount": "TotalDiscount",
  "Paid Amount": "paidamt",
  "Balance Due": "baldue",
  
  // Invoice Fields
  "Invoice Number": "invoiceno",
  "Invoice Date": "InvoiceDate",
  "Payment Mode": "PaymentMode",
  
  // Tables
  "Sale Items Table": "SaleDetailsTable",
  "Extra Charges": "ExtraChargesTable",
  
  // Bank Fields
  "Account Name": "AccountName",
  "Bank Name": "BankName",
  "Account Number": "AccountNumber",
  "IFSC Code": "IFSCCode",
  "Branch Name": "BranchName"
};

// 3. Create TEMPLATES object with ALL TemplateKeys defined
export const TEMPLATES: Record<TemplateKey, Record<string, string>> = {
  receipt: {
    ...BASE_TEMPLATE_FIELDS,
    // Receipt-specific fields can be added here
    "Receipt Number": "ReceiptNo",
    "Cashier Name": "CashierName"
  },
  
  orderreceipt: {
    ...BASE_TEMPLATE_FIELDS,
    // Order Receipt specific fields
    "Order Number": "OrderNo",
    "Order Date": "OrderDate",
    "Delivery Date": "DeliveryDate",
    "Shipping Address": "ShippingAddress",
    "Order Status": "OrderStatus"
  },
  
  purchase: {
    ...BASE_TEMPLATE_FIELDS,
    // Purchase specific fields
    "Vendor Name": "VendorName",
    "Vendor Contact": "VendorContact",
    "Purchase Order No": "PONumber",
    "Purchase Date": "PurchaseDate",
    "Delivery Terms": "DeliveryTerms"
  },
  
  invoice: {
    ...BASE_TEMPLATE_FIELDS,
    // Invoice specific fields
    "Invoice To": "CustomerName",
    "Due Date": "DueDate",
    "Subtotal": "SubTotal",
    "Tax": "TaxAmount",
    "Total": "TotalAmount",
    "Terms & Conditions": "Terms"
  },
  
  quotation: {
    ...BASE_TEMPLATE_FIELDS,
    // Quotation specific fields
    "Quotation Number": "QuotationNo",
    "Quotation Date": "QuotationDate",
    "Valid Until": "ValidUntil",
    "Subject": "Subject",
    "Quotation Total": "QuotationTotal"
  }
};