import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OldCustomerDTO } from '../../../DTO/DTO';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { SaleserviceService } from '../../../services/saleservice.service';

@Component({
  selector: 'app-old-customer-popup',
  standalone: true,
  templateUrl: './old-customer-popup.component.html',
  styleUrls: ['./old-customer-popup.component.css'],
  imports: [CommonModule, FormsModule]
})
export class OldCustomerPopupComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
   @Output() customerSelected = new EventEmitter<any>();

  oldCustomers: OldCustomerDTO[] = [];
  searchTerm: string = '';
  isLoading: boolean = false; // 🔹 loader flag

  // Pagination
  filter: PaginationFilter = {
    pageNo: 1,
    pageSize: 10,
    searchTerm: '',
    startDate: null,
    endDate: null
  };

  constructor(private salesservice: SaleserviceService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  closePopup() {
    this.close.emit();
  }

 loadCustomers() {
    this.isLoading = true; // 🔹 show loader
    this.filter.searchTerm = this.searchTerm;

    this.salesservice.getOldCustomers(this.filter).subscribe({
      next: (res) => {
        this.oldCustomers = res || [];
        this.isLoading = false; // 🔹 hide loader
      },
      error: () => {
        this.oldCustomers = [];
        this.isLoading = false; // 🔹 hide loader
      }
    });
  }
  // Filter locally for search bar while typing
  getFilteredCustomers() {
    if (!this.searchTerm) return this.oldCustomers;
    const term = this.searchTerm.toLowerCase();
    return this.oldCustomers.filter(c =>
      c.customerName.toLowerCase().includes(term) ||
      c.phoneNo.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.remark.toLowerCase().includes(term) // if you want to include remark
    );
  }

   selectCustomer(customer: any) {
    this.customerSelected.emit(customer);
    this.closePopup(); // optionally close popup after selection
  }

}
