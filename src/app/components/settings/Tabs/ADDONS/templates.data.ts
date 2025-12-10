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
    fields: ['AccountName', 'BankName', 'AccountNumber', 'IFSCCode']
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

// 4. Quick templates for one-click insertion
export const QUICK_TEMPLATES: Record<TemplateKey, string> = {
  receipt: `
    <div class="receipt" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1e40af;">{{CompanyName}}</h1>
        <p style="margin: 5px 0; color: #666;">{{Address}}</p>
        <p style="margin: 5px 0; color: #666;">Phone: {{ContactNo}} | Email: {{CompanyEmail}}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <p><strong>Receipt #:</strong> {{invoiceno}}</p>
          <p><strong>Date:</strong> {{InvoiceDate}}</p>
        </div>
        <div>
          <p><strong>Customer:</strong> {{CustomerName}}</p>
          <p><strong>Phone:</strong> {{PhoneNo}}</p>
        </div>
      </div>
      
      {{SaleDetailsTable}}
      
      <div style="border-top: 1px solid #ccc; padding-top: 15px; margin-top: 20px;">
        <p style="text-align: right;"><strong>Total Amount:</strong> {{TotalAmount}}</p>
        <p style="text-align: right;"><strong>Paid Amount:</strong> {{paidamt}}</p>
        <p style="text-align: right;"><strong>Balance Due:</strong> {{baldue}}</p>
        <p style="text-align: right;"><strong>Payment Mode:</strong> {{PaymentMode}}</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 2px dashed #ccc;">
        <p>Thank you for your business!</p>
        <p style="font-size: 12px; color: #666;">For any queries, contact: {{ContactNo}}</p>
      </div>
    </div>
  `,
  
  orderreceipt: `
    <div style="font-family: Arial, sans-serif;">
      <h2>ORDER RECEIPT</h2>
      <p><strong>Order #:</strong> {{OrderNo}}</p>
      <!-- Add order receipt template -->
    </div>
  `,
  
  purchase: `
    <div style="font-family: Arial, sans-serif;">
      <h2>PURCHASE RECEIPT</h2>
      <p><strong>Vendor:</strong> {{VendorName}}</p>
      <!-- Add purchase template -->
    </div>
  `,
  
  invoice: `
    <div style="font-family: Arial, sans-serif;">
      <h2>INVOICE</h2>
      <p><strong>Invoice To:</strong> {{CustomerName}}</p>
      <!-- Add invoice template -->
    </div>
  `,
  
  quotation: `
    <div style="font-family: Arial, sans-serif;">
      <h2>QUOTATION</h2>
      <p><strong>Quotation #:</strong> {{QuotationNo}}</p>
      <!-- Add quotation template -->
    </div>
  `
};

// 5. Template metadata for UI display
export const TEMPLATE_METADATA: Record<TemplateKey, { name: string; icon: string; description: string }> = {
  receipt: {
    name: 'Sales Receipt',
    icon: 'bi bi-receipt-cutoff',
    description: 'For retail sales and customer receipts'
  },
  orderreceipt: {
    name: 'Order Receipt',
    icon: 'bi bi-cart-check',
    description: 'For order confirmations and bookings'
  },
  purchase: {
    name: 'Purchase Receipt',
    icon: 'bi bi-box-seam',
    description: 'For purchase orders and vendor receipts'
  },
  invoice: {
    name: 'Invoice',
    icon: 'bi bi-file-text',
    description: 'For business invoices and billing'
  },
  quotation: {
    name: 'Quotation',
    icon: 'bi bi-file-earmark-text',
    description: 'For price quotes and estimates'
  }
};