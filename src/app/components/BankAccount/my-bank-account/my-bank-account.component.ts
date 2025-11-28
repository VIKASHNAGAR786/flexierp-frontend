import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaveCompanyBankAccounts } from '../../../MODEL/MODEL';
import { CommonService } from '../../../services/common.service';
import { AlertService } from '../../../services/alert.service';
import { CompanyBankAccountDto } from '../../../DTO/DTO';

@Component({
  selector: 'app-my-bank-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bank-account.component.html',
  styleUrls: ['./my-bank-account.component.css']
})
export class MyBankAccountComponent implements OnInit {

  ngOnInit(): void {
    this.loadAccounts();
  }
  constructor(
    private commonservice: CommonService,
    private alertservice: AlertService
  ) { }

  saveCompanyBankAccounts: SaveCompanyBankAccounts = this.resetcompanyaccountform();
  bankList: CompanyBankAccountDto[] = [];
  saveBankAccount() {
    try {
      this.commonservice.SaveCompanyBankAccounts(this.saveCompanyBankAccounts).subscribe({
        next: () => {
          this.loadAccounts();
        },
        error: (err) => {
          this.alertservice.showAlert('Failed to save note:', err);
        },
        complete: () => {
          this.alertservice.showAlert('✅ Note saved successfully.', 'success');
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      this.alertservice.showAlert('❌ Something went wrong.', "error");
    }
  }

  loadAccounts() {
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
  cancel() {
    this.saveCompanyBankAccounts = this.resetcompanyaccountform();
  }
  isHoverSave = false;

  editBank(item: CompanyBankAccountDto) {
    this.saveCompanyBankAccounts.accountname = item.account_name ?? '';
    this.saveCompanyBankAccounts.bankname = item.bank_name ?? '';
    this.saveCompanyBankAccounts.accountnumber = item.account_number ?? '';
    this.saveCompanyBankAccounts.ifsccode = item.ifsc_code ?? '';
    this.saveCompanyBankAccounts.branchname = item.branch_name ?? '';
    this.saveCompanyBankAccounts.accounttype = item.account_type ?? 'CURRENT';
    this.saveCompanyBankAccounts.rowid = item.company_bank_id ?? 0;
  }
  deleteBank(item: number) {

  }

  toggleUseOnPrint(selectedBank: CompanyBankAccountDto) {
    this.saveCompanyBankAccounts = this.resetcompanyaccountform();
        this.saveCompanyBankAccounts.accountname = selectedBank.account_name ?? '';
    this.saveCompanyBankAccounts.bankname = selectedBank.bank_name ?? '';
    this.saveCompanyBankAccounts.accountnumber = selectedBank.account_number ?? '';
    this.saveCompanyBankAccounts.ifsccode = selectedBank.ifsc_code ?? '';
    this.saveCompanyBankAccounts.branchname = selectedBank.branch_name ?? '';
    this.saveCompanyBankAccounts.accounttype = selectedBank.account_type ?? 'CURRENT';
    this.saveCompanyBankAccounts.rowid = selectedBank.company_bank_id ?? 0;
    this.saveCompanyBankAccounts.useonprint = selectedBank.useonprint === 1 ? 0 : 1;
    this.saveBankAccount();
    this.saveCompanyBankAccounts = this.resetcompanyaccountform();
  }

  resetcompanyaccountform(): SaveCompanyBankAccounts {
    return {
      accountname: undefined,
      bankname: undefined,
      accountnumber: undefined,
      ifsccode: undefined,
      branchname: undefined,
      accounttype: undefined,
      rowid: undefined,
      useonprint: undefined,
    };
  }

}
