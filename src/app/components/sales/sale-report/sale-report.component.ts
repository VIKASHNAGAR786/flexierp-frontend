import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface SaleReport {
  saleNo: number;
  customerName: string;
  totalItems: number;
  totalAmount: number;
  totalDiscount: number;
  orderDate: string;
  createdBy: string;
  paymentMode: string;
}

@Component({
  selector: 'app-sale-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.css']
})

export class SaleReportComponent {
  filter = {
    searchTerm: '',
    startDate: '',
    endDate: '',
    pageNo: 1,
    pageSize: 5
  };

  pageSizes = [5, 10, 20];

  sales: SaleReport[] = [
    { saleNo: 1, customerName: 'John Doe', totalItems: 3, totalAmount: 500, totalDiscount: 50, orderDate: '2025-09-01', createdBy: 'Admin', paymentMode: 'Cash' },
    { saleNo: 2, customerName: 'Jane Smith', totalItems: 2, totalAmount: 300, totalDiscount: 20, orderDate: '2025-09-02', createdBy: 'Admin', paymentMode: 'Card' },
    { saleNo: 3, customerName: 'Alice', totalItems: 5, totalAmount: 1000, totalDiscount: 100, orderDate: '2025-09-03', createdBy: 'Admin', paymentMode: 'Cash' },
    { saleNo: 4, customerName: 'Bob', totalItems: 1, totalAmount: 150, totalDiscount: 10, orderDate: '2025-09-04', createdBy: 'Admin', paymentMode: 'Card' },
    { saleNo: 5, customerName: 'Charlie', totalItems: 4, totalAmount: 700, totalDiscount: 70, orderDate: '2025-09-05', createdBy: 'Admin', paymentMode: 'Cash' },
  ];

  get filteredSales() {
    return this.sales
      .filter(sale =>
        sale.customerName.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
      )
      .slice((this.filter.pageNo - 1) * this.filter.pageSize, this.filter.pageNo * this.filter.pageSize);
  }

  totalPages = Math.ceil(this.sales.length / this.filter.pageSize);

  prevPage() {
    if (this.filter.pageNo > 1) this.filter.pageNo--;
  }

  nextPage() {
    if (this.filter.pageNo < this.totalPages) this.filter.pageNo++;
  }

  getSaleData() {
    this.totalPages = Math.ceil(
      this.sales.filter(sale =>
        sale.customerName.toLowerCase().includes(this.filter.searchTerm.toLowerCase())
      ).length / this.filter.pageSize
    );
    if (this.filter.pageNo > this.totalPages) this.filter.pageNo = this.totalPages;
  }
}
