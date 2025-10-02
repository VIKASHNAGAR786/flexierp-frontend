import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationFilter } from '../../../MODEL/MODEL';

interface Customer {
  customerId: number;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  totalBalance: number;
  lastTransactionDate: string;
  openingBalance?: number;
  totalDebit?: number;
  totalCredit?: number;
  outstandingBalance?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-customers-statement-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-statement-report.component.html',
  styleUrl: './customers-statement-report.component.css'
})
export class CustomersStatementReportComponent implements OnInit {
  
  constructor() { 
     this.filter = {
      startDate: this.today,
      endDate: this.today,
      searchTerm: '',
      pageNo: 1,
      pageSize: 10
    };
  }
  readonly today: string = new Date().toISOString().split('T')[0];
  filter: PaginationFilter;  
  pageSizes: number[] = [10, 20, 50];
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  ngOnInit(): void {
    // dummy data (replace with API call later)
    this.customers = [
      { customerId: 1, customerName: "Ramesh Kumar", phone: "9876543210", email: "ramesh@example.com", city: "Jaipur", totalBalance: 12000, lastTransactionDate: "2025-09-20" },
      { customerId: 2, customerName: "Sita Devi", phone: "9123456780", email: "sita@example.com", city: "Delhi", totalBalance: -5000, lastTransactionDate: "2025-09-25" },
      { customerId: 3, customerName: "Amit Sharma", phone: "9988776655", email: "amit@example.com", city: "Mumbai", totalBalance: 3000, lastTransactionDate: "2025-09-28" }
    ];
  }

  onRowClick(customer: Customer) {
    this.selectedCustomer = customer;
    console.log("Selected Customer:", customer);

    // later: call API to fetch full statement
    // this.customerService.getCustomerStatement(customer.customerId).subscribe(...)
  }
  getCustomerData() {
  }

  exportToPdf() {
    
  }

  exportToExcel() {
   
  }
    partyStatement: any
 showPartyStatement = false;
  viewCustomerStatement(id: number) {
    this.showPartyStatement = true;
    this.partyStatement = [
  {
    paidAmount: 5000,
    balanceDue: 2000,
    totalAmt: 7000,
    paymentModeType: "UPI",
    transactionType: "Sale",
    saleDate: new Date(),
    totalItems: 10,
    totalDiscount: 500,
    tax: 200,
    transactionDate: new Date()
  },
  {
    paidAmount: 1000,
    balanceDue: 0,
    totalAmt: 1000,
    paymentModeType: "Cash",
    transactionType: "Return",
    saleDate: new Date(),
    totalItems: 2,
    totalDiscount: 0,
    tax: 50,
    transactionDate: new Date()
  }
];

  }

  nextPage() {
   
  }

  prevPage() {
   
  }
 

}
