import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { ReceivedChequeDto } from '../../../DTO/DTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../../../shared/tooltip.directive';

@Component({
  selector: 'app-cheque-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './cheque-summary.component.html',
  styleUrl: './cheque-summary.component.css'
})
export class ChequeSummaryComponent {

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
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

    readonly today: string;
    filter: PaginationFilter;
    pageSizes: number[] = [10, 20, 50];
    chequedata: ReceivedChequeDto[] = [];
    totalRecords: number = 0;
    
      get totalPages(): number {
    return Math.ceil(this.totalRecords / this.filter.pageSize) || 1;
  }

  ngOnInit(): void {
    this.loadGetReceivedCheques();
  }

    loadGetReceivedCheques() {
    this.commonService.GetReceivedCheques(this.filter).subscribe({
      next: (data) => {
        if (data) {
          this.chequedata = data;
          this.totalRecords = data.length > 0 ? data[0].totalRecords : 0;
         this.cdr.detectChanges(); // force Angular to render table rows
        }
      },
      error: (err) => console.error(err)
    });
  }

   nextPage() {
    if (this.filter.pageNo < this.totalPages) {
      this.filter.pageNo++;
      this.loadGetReceivedCheques();
    }
  }

  prevPage() {
    if (this.filter.pageNo > 1) {
      this.filter.pageNo--;
      this.loadGetReceivedCheques();
    }
  }

  
}

