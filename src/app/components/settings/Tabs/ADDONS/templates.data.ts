// templates.data.ts
export type TemplateKey = 'receipt' | 'orderreceipt' | 'purchase';

export const TEMPLATES: Record<TemplateKey, Record<string, string>> = {
  receipt: {
    'First Names': 'FirstName',
    'Email Address': 'Email',
    'Phone Number': 'Phone',
    'Receipt No': 'receiptno'
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