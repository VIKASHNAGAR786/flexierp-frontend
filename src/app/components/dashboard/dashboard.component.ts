import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DashboardMetricsDto } from '../../DTO/DTO';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(
    private commonservice: CommonService
  ) {
  }
  startDate: string = '2025-10-06';
  endDate: string = '2025-10-06';
  ngOnInit(): void {
    this.loaddashboarddata();
  }


  dashboarddata: DashboardMetricsDto | any;
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
