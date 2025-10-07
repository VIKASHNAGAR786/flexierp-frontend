import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DashboardMetricsDto } from '../../DTO/DTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  dashboarddata: DashboardMetricsDto | any;
  startDate: string = '';
  endDate: string = '';
  selectedRange: string = '7'; // default — Last 7 Days
  reportIsLoading: boolean = false;

  constructor(
    private commonservice: CommonService,
    private alertservice: AlertService
  ) {
  }
  
  ngOnInit(): void {
    this.setDateRange(+this.selectedRange);
    this.loaddashboarddata();
  }

  /** Called whenever user changes the dropdown */
  onDateRangeChange() {
    this.setDateRange(+this.selectedRange);
    this.loaddashboarddata();
  }

  /** Calculates startDate & endDate based on range */
  setDateRange(days: number) {
    const end = new Date();
    const start = new Date();

    start.setDate(end.getDate() - days + 1);

    // Format YYYY-MM-DD
    this.startDate = start.toISOString().split('T')[0];
    this.endDate = end.toISOString().split('T')[0];
  }

  /** Calls your API */
  loaddashboarddata() {
    this.commonservice.GetDashboardMetricsAsync(this.startDate, this.endDate).subscribe({
      next: (data) => {
        if (data) {
          this.dashboarddata = data;
        }
      },
      error: (err) => console.error(err),
    });
  }

pdfBlobUrl: string | null = null;

async exportToPdf() {
  this.reportIsLoading = true;

  try {
    const blob = await firstValueFrom(
      this.commonservice.GenerateDashboardPdf(this.startDate, this.endDate)
    );

    if (blob) {
      this.pdfBlobUrl = URL.createObjectURL(blob);
      this.printPdf();
    } else {
      this.alertservice.showAlert('No data found for selected date range.', 'warning');
    }

  } catch (error) {
    console.error('Failed to generate PDF:', error);
    this.alertservice.showAlert('Failed to generate PDF. Please try again later.', 'error');

  } finally {
    this.reportIsLoading = false;
  }
}
printPdf() {
  if (this.pdfBlobUrl) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = this.pdfBlobUrl;

    // Wait until the iframe loads the PDF
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };

    document.body.appendChild(iframe);

    // Remove iframe after a delay (give enough time for printing)
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(this.pdfBlobUrl!);
      this.pdfBlobUrl = null;
    }, 500000); // 5 minutes delay
  }
}

async exportToExcel() {
  this.reportIsLoading = true;

  try {
    // Convert observable to promise for async/await use
    const blob = await firstValueFrom(
      this.commonservice.GenerateDashboardExcel(this.startDate, this.endDate)
    );

    if (blob) {
      this.commonservice.downloadFile(blob, 'ProductReport.xlsx');
      this.alertservice.showAlert(
        'File Downloaded Successfully Inside Download Folder',
        'success'
      );
    } else {
      this.alertservice.showAlert('No data found for selected date range.', 'warning');
    }

  } catch (error) {
    console.error('Error while exporting Excel:', error);
    this.alertservice.showAlert('Failed to export Excel file. Please try again later.', 'error');
  } finally {
    // Always hide loader
    this.reportIsLoading = false;
  }
}



}