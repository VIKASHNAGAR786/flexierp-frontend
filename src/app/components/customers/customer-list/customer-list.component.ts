import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerWithSalesDTO } from '../../../DTO/DTO';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { SaleserviceService } from '../../../services/saleservice.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {
  customers: CustomerWithSalesDTO[] = [];
  private today: string;
  public filter: PaginationFilter;
  isLoading = false;
  pageSizes = [5, 10, 20, 50];
  totalPages = 1;

  constructor(private http: HttpClient,
    private saleservice: SaleserviceService
  ) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    this.today = `${yyyy}-${mm}-${dd}`;
    this.filter = {
      startDate: this.today,
      endDate: this.today,
      searchTerm: '',
      pageNo: 1,
      pageSize: 10
    };
  }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers() {
    this.isLoading = true;
    this.saleservice.getCustomersWithSales(this.filter)
      .subscribe({
        next: (data) => {
          if (data) {
            this.customers = data;
            if (data.length > 0) {
              this.totalPages = Math.ceil(data[0].totalRecords / this.filter.pageSize);
            } else {
              this.totalPages = 1;
            }
          }
          this.isLoading = false;
        },
        error: () => {
          this.customers = [];
          this.isLoading = false;
        }
      });
  }

  onSearchChange() {
    this.filter.pageNo = 1;
    this.getCustomers();
  }

  onPageSizeChange() {
    this.filter.pageNo = 1;
    this.getCustomers();
  }

  prevPage() {
    if (this.filter.pageNo > 1) {
      this.filter.pageNo--;
      this.getCustomers();
    }
  }

  nextPage() {
    if (this.filter.pageNo < this.totalPages) {
      this.filter.pageNo++;
      this.getCustomers();
    }
  }
}
