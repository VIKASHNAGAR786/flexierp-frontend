import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';
import { CommonService } from '../../services/common.service';
import { PaginationFilter } from '../../MODEL/MODEL';
import { UserLoginHistoryDTO } from '../../DTO/DTO';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProfileViewComponent implements OnInit {
  constructor(
    private userInfo: UserinfowithloginService,
    private commonService: CommonService
  ) { }
  // Dummy data - later connect with backend
  username = '';
  email = 'john.doe@example.com';
  phone = '+91 00000 00000';

  ngOnInit() {
    this.username = this.userInfo.getUserName() || 'Guest';
    this.email = this.userInfo.getUserEmail() || 'john.doe@example.com';
    this.phone = this.userInfo.getUserMobileNo() || '+91 00000 00000';

    this.loadHistory();
  }
  showwditprofile = false;

  editableProfile: any = {};

  editingProfile() {
    this.showwditprofile = !this.showwditprofile;
  }
  closeEdit() {
    this.showwditprofile = false;
  }
  saveProfile() {
    // Save logic here
    this.showwditprofile = false;
  }

  historyList: UserLoginHistoryDTO[] = [];
  pageNo: number = 1;
  pageSize: number = 20;
  totalRecords: number = 0;
  loading: boolean = false;

  loadHistory(): void {
    const filter: PaginationFilter = {
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      startDate: null, // or provide a valid date if needed
      endDate: null,   // or provide a valid date if needed
      searchTerm: ''   // or provide a valid search term if needed
    };

    this.commonService.GetUserLoginHistory(filter).subscribe({
      next: (data) => {
        if (data) this.historyList = data;
      },
      error: (err) => console.error('Failed to load login history', err)
    });
  }
}
