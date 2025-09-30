import { Component } from '@angular/core';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { ProviderDTO } from '../../../DTO/DTO';
import { InventoryService } from '../../../services/inventory.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendors-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './vendors-list.component.html',
  styleUrl: './vendors-list.component.css'
})
export class VendorsListComponent {

   readonly today: string;
   filter: PaginationFilter;

  pageSizes = [20, 30, 50];

  providers: ProviderDTO[] = [];
  totalRows: number = 0;
  totalPages: number = 1;
  loading: boolean = false;

  constructor(
    private inventoryService: InventoryService
  )
  {
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
      pageSize: this.pageSizes[0]
    };
  }

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;

    this.inventoryService.GetProviders(this.filter)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        if (res && res.length > 0) {
          this.providers = res;
          this.totalRows = res[0].totalRows; // TotalRows from API
          this.totalPages = Math.ceil(this.totalRows / this.filter.pageSize);
        } else {
          this.providers = [];
          this.totalRows = 0;
          this.totalPages = 1;
        }
      });
  }

  prevPage() {
    if (this.filter.pageNo > 1) {
      this.filter.pageNo--;
      this.loadSales();
    }
  }

  nextPage() {
    if (this.filter.pageNo < this.totalPages) {
      this.filter.pageNo++;
      this.loadSales();
    }
  }

  onSearchChange() {
    this.filter.pageNo = 1; // Reset page
    this.loadSales();
  }

  onPageSizeChange() {
    this.filter.pageNo = 1;
    this.loadSales();
  }
}
