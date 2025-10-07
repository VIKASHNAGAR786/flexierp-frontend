import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DashboardMetricsDto } from '../../DTO/DTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(
    private commonservice: CommonService
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
}