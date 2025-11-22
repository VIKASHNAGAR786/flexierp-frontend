import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { BalanceDueDto } from '../../../DTO/DTO';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipDirective } from '../../../shared/tooltip.directive';
import { SaveChequePaymentDto, SettleBalance } from '../../../MODEL/MODEL';
import { AlertService } from '../../../services/alert.service';
import { ChequePopupComponent } from "../../../shared/cheque-popup/cheque-popup.component";
import { BanktransferpopupComponent } from "../../../shared/banktransferpopup/banktransferpopup.component";

@Component({
  selector: 'app-balance-due',
  imports: [CommonModule, FormsModule, TooltipDirective, ReactiveFormsModule, ChequePopupComponent, BanktransferpopupComponent],
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
  totalamountforseleceddue = 0;
  showChequePopup = false;
  showBankTransferPopup = false;

  cheque: SaveChequePaymentDto = this.resetCheque();
  ngOnInit(): void {
    this.loadBalanceDueList();
  }
  constructor(
    private commonservice: CommonService,
    private alertservice: AlertService
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
  onSettleBalance(balance: BalanceDueDto) {
    this.showSettlePopup = true;
    this.settleBalance.settledamount = balance.totalDueAmount;
    this.totalamountforseleceddue = this.settleBalance.settledamount!;
    this.settleBalance.customerid = balance.customerId;
    this.settleBalance.dueid = balance.dueId;
    this.settleBalance.remainingamount = 0; // default
    console.log('🧾 Settling Balance for Amount:', balance);
  }

  // 🧹 Close modal
  closePopup() {
    this.showSettlePopup = false;
    this.settleBalance = {}; // Reset form
  }

  confirmSettle() {
    try {
      console.log('🧾 Settlement Details:', this.settleBalance);
      this.showSettlePopup = false;

      // ✅ Validate required fields before sending
      if (
        !this.settleBalance ||
        this.settleBalance.settledamount == null ||
        this.settleBalance.customerid == null ||
        this.settleBalance.dueid == null ||
        this.settleBalance.remainingamount == null ||
        this.settleBalance.paymode == null
      ) {
        this.alertservice.showAlert("⚠️ Missing settlement details. Please fill all fields.", "warning");
        return;
      }

      // ✅ Prepare payload
      const payload: SettleBalance = {
        settledamount: this.settleBalance.settledamount!,
        customerid: this.settleBalance.customerid!,
        dueid: this.settleBalance.dueid!,
        remainingamount: this.settleBalance.remainingamount!,
        paymode: this.settleBalance.paymode!,
        chequepayment: this.settleBalance.paymode == 2 ? this.settleBalance.chequepayment : undefined
      };


      // ✅ API call with subscription handling
      this.commonservice.SaveCustomerBalanceSettlement(payload).subscribe({
        next: (data) => {
          this.alertservice.showAlert("✅ Record saved successfully", "success");
          this.loadBalanceDueList(); // Refresh list
          this.settleBalance = {}; // Reset form
        },
        error: (error) => {
          console.error('❌ Error saving settlement:', error);
          this.alertservice.showAlert("❌ Failed to save record. Please try again.", "error");
        },
        complete: () => {
          console.log('✅ Settlement save request completed');
        }
      });
    }
    catch (error) {
      console.error('⚠️ Exception in confirmSettle():', error);
      this.alertservice.showAlert("Unexpected error occurred. Please check console.", "error");
    }
    finally {
      // Optional: cleanup actions
      console.log('🧹 confirmSettle() execution finished.');
    }
  }


  adjustRemainingAmount() {
    if (!this.settleBalance) return;

    // Ensure settled amount isn't null
    const settled = this.settleBalance.settledamount || 0;

    // 1️⃣ Restrict settled amount ≤ 500
    if (settled > this.totalamountforseleceddue) {
      this.alertservice.showAlert(`"⚠️ Settled amount cannot exceed ₹ ${this.totalamountforseleceddue} ."`, "warning");
      this.settleBalance.settledamount = this.totalamountforseleceddue;
    }

    // 2️⃣ Calculate remaining automatically
    const total = this.totalamountforseleceddue; // example total for now
    this.settleBalance.remainingamount = total - (this.settleBalance.settledamount || 0);

    // 3️⃣ Prevent negative remaining amount
    if (this.settleBalance.remainingamount < 0) {
      this.settleBalance.remainingamount = 0;
    }
  }

  onPaymentModeChange(event: any) {
    this.cheque = this.resetCheque();
    if (this.settleBalance.paymode == 2) { // Assuming '2' represents Cheque
      this.showChequePopup = true;
    }else if (this.settleBalance.paymode == 3) { // Assuming '3' represents Bank Transfer
      this.showBankTransferPopup = true;
      this.showSettlePopup = false;
    }
  }

  cancelCheque() {
    this.showChequePopup = false;
    this.settleBalance.paymode = 1;
    this.cheque = this.resetCheque();
  }

  resetCheque(): SaveChequePaymentDto {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    return {
      chequeNumber: '',
      bankName: '',
      branchName: '',
      chequeDate: formattedDate,
      amount: 0,
      ifsc_Code: '',
      createdBy: 0
    };
  }

  saveCheque(event: SaveChequePaymentDto) {
  this.cheque = event;   // <--- received from popup
  console.log("Cheque Details FROM POPUP:", this.cheque);

  this.showChequePopup = false;
  this.settleBalance.chequepayment = this.cheque;

  this.settleBalance.settledamount = this.cheque.amount;
  this.settleBalance.remainingamount =
    this.totalamountforseleceddue - this.cheque.amount;

  if (this.cheque.amount <= 0) {
    this.alertservice.showAlert("⚠️ Invalid cheque amount.", "error");
    this.settleBalance.paymode = 1;
  }
}

//#region 🟢 Popup Controls
  cancelBanktransfer() {
    this.showBankTransferPopup = false;
    this.settleBalance.paymode = 1;
    this.showSettlePopup = true;
  }

  saveBankTransfer(event: any) {
  this.showBankTransferPopup = false;
  this.showSettlePopup = true;
}
//#endregion
}