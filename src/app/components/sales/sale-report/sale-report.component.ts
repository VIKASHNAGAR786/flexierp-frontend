import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaleDTO } from '../../../DTO/DTO';
import { finalize } from 'rxjs/operators';
import { SaleserviceService } from '../../../services/saleservice.service';
import { PaginationFilter } from '../../../MODEL/MODEL';

@Component({
  selector: 'app-sale-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.css']
})
export class SaleReportComponent implements OnInit {
   readonly today: string;
   filter: PaginationFilter;

  pageSizes = [5, 10, 20];

  sales: SaleDTO[] = [];
  totalRows: number = 0;
  totalPages: number = 1;
  loading: boolean = false;

  constructor(
    private saleService: SaleserviceService
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
      pageSize: 10
    };
  }

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;

    this.saleService.GetSale(this.filter)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        if (res && res.length > 0) {
          this.sales = res;
          this.totalRows = res[0].totalRows; // TotalRows from API
          this.totalPages = Math.ceil(this.totalRows / this.filter.pageSize);
        } else {
          this.sales = [];
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
  exportToExcel() {
    console.log("Excel export triggered ✅");
    // TODO: Implement with XLSX
  }

  exportToPDF() {
    console.log("PDF export triggered ✅");
    // TODO: Implement with jsPDF
  }
}
