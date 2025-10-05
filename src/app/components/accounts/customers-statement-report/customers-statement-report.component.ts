import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { SaleserviceService } from '../../../services/saleservice.service';
import { CustomerLedgerDetailDto, CustomerLedgerDto } from '../../../DTO/DTO';


@Component({
  selector: 'app-customers-statement-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-statement-report.component.html',
  styleUrl: './customers-statement-report.component.css'
})
export class CustomersStatementReportComponent implements OnInit {
  
  constructor(
    private saleservice:SaleserviceService
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

  ngOnInit(): void {
    this.getCustomerData();
  
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

  exportToPdf() {
    
  }

  exportToExcel() {
   
  }
public  partyStatement: CustomerLedgerDetailDto[] = [];
 showPartyStatement = false;
  viewCustomerStatement(id: number) {
    this.showPartyStatement = true;
    this.saleservice.GetCustomerledgerdetails(id).subscribe({
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
 

}
