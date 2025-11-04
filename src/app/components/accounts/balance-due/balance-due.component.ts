import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { BalanceDueDto } from '../../../DTO/DTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../../../shared/tooltip.directive';
import { SettleBalance } from '../../../MODEL/MODEL';

@Component({
  selector: 'app-balance-due',
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './balance-due.component.html',
  styleUrl: './balance-due.component.css'
})
export class BalanceDueComponent implements OnInit {

  BalanceDueDtos: BalanceDueDto[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  searchTerm: string = '';
  showSettlePopup = false;
  settleBalance: Partial<SettleBalance> = {};


  ngOnInit(): void {
    this.loadBalanceDueList();
  }
  constructor(
    private commonservice: CommonService
  ) { }

  loadBalanceDueList() {
    this.commonservice.getBalanceDueList(this.pageNumber, this.pageSize, this.searchTerm)
      .subscribe((data) => {
        this.BalanceDueDtos = data || [];
        console.log('Balance Due List:', data);
      }, (error) => {
        console.error('Error fetching balance due list:', error);
      });
}


 nextPage() {
    if (this.pageNumber < this.BalanceDueDtos[0]?.totalrecords! / this.pageSize) {
      this.pageNumber++;
      this.loadBalanceDueList();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadBalanceDueList();
    }
  }

  
  // 🪄 Called on button click
  onSettleBalance(totalDueAmount: number) {
    this.showSettlePopup = true;
    this.settleBalance.settledamount = totalDueAmount;
    this.settleBalance.remainingamount = 0;
    console.log('🧾 Settling Balance for Amount:', totalDueAmount);
  }

  // 🧹 Close modal
  closePopup() {
    this.showSettlePopup = false;
  }

  confirmSettle() {
    console.log('🧾 Settlement Details:', this.settleBalance);
    this.showSettlePopup = false;
  }

}