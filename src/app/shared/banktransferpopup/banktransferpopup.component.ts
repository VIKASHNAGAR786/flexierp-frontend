import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { on } from 'events';
import { SaveBankTransferPaymentDto } from '../../MODEL/MODEL';
import { CommonService } from '../../services/common.service';
import { AlertService } from '../../services/alert.service';
import { CompanyBankAccountDto } from '../../DTO/DTO';

@Component({
  selector: 'app-banktransferpopup',
  imports: [CommonModule, FormsModule],
  templateUrl: './banktransferpopup.component.html',
  styleUrl: './banktransferpopup.component.css'
})
export class BanktransferpopupComponent implements OnInit {

  constructor(private commonservice: CommonService, 
    private alertservice: AlertService
  ){}
  bankList: CompanyBankAccountDto[] = [];
  ngOnInit(): void {
    this.loadAccounts();
    // set defaults
    if (!this.transfer.currency) this.transfer.currency = 'INR';
    if (!this.transfer.status) this.transfer.status = 'Pending';
    if (!this.transfer.remarks) this.transfer.remarks = ' ';
    if (!this.transfer.is_reconciled) this.transfer.is_reconciled = false;
  }

  @Input() show: boolean = false;
  @Input() transfer!: SaveBankTransferPaymentDto;


  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit(); // parent will hide popup
  }

  saveTransfer() {
    this.save.emit(this.transfer); // send data to parent
  }

  loadAccounts(){
    try {
      this.commonservice.GetCompanyBankAccounts().subscribe({
        next: (data) => {
          this.bankList = data || [];
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      this.alertservice.showAlert('❌ Something went wrong.', "error");
    }
  }
}
