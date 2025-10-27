import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaleDTO } from '../../../DTO/DTO';
import { finalize } from 'rxjs/operators';
import { SaleserviceService } from '../../../services/saleservice.service';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { AlertService } from '../../../services/alert.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

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
  customername:string = '';

  constructor(
    private saleService: SaleserviceService,
    private alertservice: AlertService,
    private sanitizer: DomSanitizer,
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
  try {
    this.saleService.GetSalesReportPdf(this.filter).subscribe({
      next: (blob) => {
        if (blob) {
          this.saleService.downloadFile(blob, 'ProductReport.pdf');
          this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
        } else {
          this.alertservice.showAlert("No data found to export.", 'warning');
        }
        this.reportIsLoading = false;
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
        this.alertservice.showAlert("Failed to download PDF file. Please try again later.", 'error');
        this.reportIsLoading = false;
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    this.alertservice.showAlert("Something went wrong. Please try again.", 'error');
    this.reportIsLoading = false;
  }
}

exportToExcel() {
  this.reportIsLoading = true;
  try {
    this.saleService.GetSalesReportExcel(this.filter).subscribe({
      next: (blob) => {
        if (blob) {
          this.saleService.downloadFile(blob, 'ProductReport.xlsx');
          this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
        } else {
          this.alertservice.showAlert("No data found to export.", 'warning');
        }
        this.reportIsLoading = false;
      },
      error: (error) => {
        console.error('Error downloading Excel:', error);
        this.alertservice.showAlert("Failed to download Excel file. Please try again later.", 'error');
        this.reportIsLoading = false;
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    this.alertservice.showAlert("Something went wrong. Please try again.", 'error');
    this.reportIsLoading = false;
  }
}

  showReceiptPopup: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;
  pdfBlobUrl!: string; // For download/print

  async seeReceipt(saleid: number, customername: string) {
    try {
      this.reportIsLoading = true;
      this.customername = customername;
      // Await the observable and get the PDF blob
      const blob = await firstValueFrom(this.saleService.GetReceiptPdf(saleid));

      this.reportIsLoading = false;

      if (blob && blob.size > 0) {
        // Create both versions
        this.pdfBlobUrl = URL.createObjectURL(blob); // Raw blob URL
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfBlobUrl); // Safe for iframe

        this.showReceiptPopup = true; // ✅ Correct variable name
      } else {
        console.error("Empty PDF blob received.");
        this.alertservice.showAlert("Failed to generate receipt. Please try again.", 'error');
      }
    } catch (err) {
      this.reportIsLoading = false;
      console.error("Error fetching receipt PDF:", err);
      this.alertservice.showAlert("Something went wrong while generating the receipt. Please try again later.", 'error');
    }
  }

  // Optional: Cleanup when closing popup
  closeReceiptPopup() {
    this.showReceiptPopup = false;
    if (this.pdfBlobUrl) {
      URL.revokeObjectURL(this.pdfBlobUrl); // cleanup
      this.pdfBlobUrl = '';
    }
  }

  downloadPdf() {
    if (this.pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = this.pdfBlobUrl;
      link.download = `${this.customername.toUpperCase()}-Receipt.pdf`;
      link.click();
    }
  }

  printPdf() {
    if (this.pdfBlobUrl) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = this.pdfBlobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
  }




}
