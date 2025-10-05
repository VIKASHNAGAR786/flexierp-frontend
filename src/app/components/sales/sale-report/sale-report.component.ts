import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaleDTO } from '../../../DTO/DTO';
import { finalize } from 'rxjs/operators';
import { SaleserviceService } from '../../../services/saleservice.service';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { AlertService } from '../../../services/alert.service';

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
  reportIsLoading: boolean = false;

  constructor(
    private saleService: SaleserviceService,
    private alertservice: AlertService
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

  exportToPdf() {
    this.reportIsLoading = true;
    this.saleService.GetSalesReportPdf(this.filter).subscribe(blob => {
      this.reportIsLoading = false;
      if (blob){
         this.saleService.downloadFile(blob, 'ProductReport.pdf');
         this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
      }
    });
  }

  exportToExcel() {
    this.reportIsLoading = true;
    this.saleService.GetSalesReportExcel(this.filter).subscribe(blob => {
      this.reportIsLoading = false;
      if (blob) {
        this.saleService.downloadFile(blob, 'ProductReport.xlsx');
        this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
      }
    });
  }

  seeReceipt(saleid: number) {
  this.reportIsLoading = true;
  this.saleService.GetReceiptPdf(saleid).subscribe(
    (blob: Blob | null) => {
      this.reportIsLoading = false;
      if (blob && blob.size > 0) {
        this.saleService.downloadFile(blob, 'Receipt.pdf');
         this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
      } else {
        console.error("Empty PDF blob received.");
        alert("Failed to generate receipt. Please try again.");
      }
    },
    (err) => {
      this.reportIsLoading = false;
      console.error("Error fetching receipt PDF:", err);
      this.alertservice.showAlert("Something went wrong while generating the receipt. Please try again later.", 'error');
    },
    () => {
      // Optional: you can log completion
      console.log("Receipt PDF request completed.");
    }
  );
}



}
