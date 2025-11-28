// templates.data.ts
export type TemplateKey = 'receipt' | 'orderreceipt' | 'purchase';

export const TEMPLATES: Record<TemplateKey, Record<string, string>> = {
  receipt: {
  "Customer Name": "CustomerName",
  "Phone Number": "PhoneNo",
  "Cus. Email Address": "Email",
  "Payment Mode": "PaymentMode",
  "Remark": "Remark",
  "Total Items": "TotalItems",
  "Total Amount": "TotalAmount",
  "Total Discount": "TotalDiscount",
  "Paid Amount": "paidamt",
  "Balance Due": "baldue",
  "Invoice No": "invoiceno",

  "Company Name": "CompanyName",
  "CompanyContactNumber": "ContactNo",
  "CompanyWhatsAppNumber": "WhatsAppNo",
  "CompanyAddress": "Address",
  "CompanyFullName": "FullName",
  "CompanyLogo": "CompanyLogo",
  "CompanyEmail": "CompanyEmail",
  "Invoice Date": "InvoiceDate",


  "SaleDetailsTable" : "SaleDetailsTable",
  "ExtraChargesTable": "ExtraCharges",

  "AccountName": "AccountName",
  "BankName": "BankName",
  "AccountNumber": "AccountNumber",
  "IFSCCode": "IFSCCode",
  "BranchName": "BranchName",
},
  orderreceipt: {
    'Order Id': 'orderid',
    'Order Date': 'orderdate',
    'Customer Name': 'customername'
  },
  purchase: {
    'Purchase Id': 'purchaseid',
    'Purchase Date': 'purchasedate',
    'Vendor Name': 'vendorname'
  }
};