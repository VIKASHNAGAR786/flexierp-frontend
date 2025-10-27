import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { SaleserviceService } from '../../../services/saleservice.service';
import { CustomerLedgerDetailDto, CustomerLedgerDto } from '../../../DTO/DTO';
import { AlertService } from '../../../services/alert.service';
import { TooltipDirective } from '../../../shared/tooltip.directive';


@Component({
  selector: 'app-customers-statement-report',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './customers-statement-report.component.html',
  styleUrl: './customers-statement-report.component.css'
})
export class CustomersStatementReportComponent implements OnInit {
  
  constructor(
    private saleservice:SaleserviceService,
    private alertservice:AlertService
  ) { 
     this.filter = {
      startDate: this.today,
      endDate: this.today,
      searchTerm: '',
      pageNo: 1,
      pageSize: 10
    };
  }
  readonly today: string = new Date().toISOString().split('T')[0];
  filter: PaginationFilter;  
  pageSizes: number[] = [10, 20, 50];
  customers: CustomerLedgerDto[] = [];
  selectedCustomer: CustomerLedgerDto | null = null;
  customername: string = '';
  contactno: string = '';
  startDate: string = '';
endDate: string = '';

  ngOnInit(): void {
    this.getCustomerData();
     const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Convert both dates to yyyy-MM-dd format
  this.startDate = sevenDaysAgo.toISOString().split('T')[0];
  this.endDate = today.toISOString().split('T')[0];
  
  }
  getCustomerData() {
     this.saleservice.GetCustomerledger(this.filter).subscribe({
      next: (data) => {
        if (data) {
          this.customers = data;
        }
      },
      error: (err) => console.error(err)
    });
  }

 exportToPdf(id: number) {
    this.saleservice.GetCustomerledgerdetailspdf(id,this.startDate,this.endDate).subscribe(blob => {
      if (blob) {
        this.saleservice.downloadFile(blob, `PartyStatement_${this.customername}.pdf`);
        this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
      }
    });
  }

   exportToPdflist() {
    
  }


  exportToExcel() {
   
  }
public  partyStatement: CustomerLedgerDetailDto[] = [];
 showPartyStatement = false;
  viewCustomerStatement(id: number) {
    this.showPartyStatement = true;
    this.saleservice.GetCustomerledgerdetails(id, this.startDate,this.endDate).subscribe({
      next: (data) => {
        if (data) {
          this.partyStatement = data;
          this.customername = this.partyStatement[0].customername.toUpperCase();
          this.contactno = this.partyStatement[0].contactno;
          
        }
      },
      error: (err) => console.error(err),
      complete: () => this.showPartyStatement = true
    });

  }

  nextPage() {
   
  }

  prevPage() {
   
  }
 
filterStatement(id: number) {
 this.viewCustomerStatement(id);
}


}
