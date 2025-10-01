import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';
import { CommonService } from '../../services/common.service';
import { PaginationFilter, UpdateCompanyInfo } from '../../MODEL/MODEL';
import { CompanyInfoDTO, UserLoginHistoryDTO } from '../../DTO/DTO';
import { AlertService } from '../../services/alert.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProfileViewComponent implements OnInit {
  constructor(
    private userInfo: UserinfowithloginService,
    private commonService: CommonService,
    private alertservice: AlertService
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
    this.GetCompanyInfo();
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
  companyInfo: CompanyInfoDTO = {
    comInfoId: 0,
    companyName: '',
    contactNo: '',
    whatsAppNo: '',
    email: '',
    address: '',
    fullName: '',
    createdDate: '',
    companyLogo: ''
  };

  updatecompany: UpdateCompanyInfo = {
  company_Name : '',
  contact_No : '',
  whatsApp_No : '',
  email : '',
  address : '',
  row_id : 0,
  file: null
};
private baseurl = environment.BASE_URL + '/Documents/';
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

  GetCompanyInfo(): void {
    this.commonService.GetCompanyInfo().subscribe({
      next: (data) => {
        if (data) this.companyInfo = data;
       if (this.companyInfo.companyLogo) {
        this.companyInfo.companyLogo = this.baseurl + this.companyInfo.companyLogo;
       }
      },
      error: (err) => console.error('Failed to load company info', err)
    });
  }

  UpdateCompanyInfo(): void {
    this.updatecompany.row_id = this.companyInfo.comInfoId;
    this.commonService.UpdateCompanyInfo(this.updatecompany).subscribe({
      next: (data) => {
        if (data) 
          this.alertservice.showAlert("Record Update Succefully", "success");
      },
      error: (err) => this.alertservice.showAlert('Failed to load company info', "error")
    });
  }

  logoPreview: string | ArrayBuffer | null = null;

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.updatecompany.file = file;

    // Preview image before uploading
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logoPreview = e.target.result;
    };
    reader.readAsDataURL(file);

    // 🔹 Call API immediately after file is chosen
    this.UpdateCompanyInfo();
  }
}

}
