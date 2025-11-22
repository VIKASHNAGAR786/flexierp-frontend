import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-bank-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bank-account.component.html',
  styleUrl: './my-bank-account.component.css'
})
export class MyBankAccountComponent {

  constructor() { }
  bank: any = {
  account_name: '',
  bank_name: '',
  account_number: '',
  ifsc_code: '',
  branch_name: '',
  account_type: 'CURRENT',
  status: 1,
  created_at: new Date()
};

  saveBankAccount() {
    // Logic to save bank account details
    console.log('Bank account saved:', this.bank);
  }
  cancel(){}
  isHoverSave=false;

  bankList = [
  // Example
  { account_name: 'Vikash', bank_name: 'SBI', account_number: '1234', ifsc_code: 'SBIN0001234', account_type: 'CURRENT', status: 1, branch_name: 'Main Branch' },
  { account_name: 'John Doe', bank_name: 'HDFC', account_number: '5678', ifsc_code: 'HDFC0005678', account_type: 'SAVINGS', status: 1, branch_name: 'City Branch' },
];

addNewBank() {
  // Logic to add a new bank account
  this.bankList.push({ account_name: '', bank_name: '', account_number: '', ifsc_code: '', account_type: '', status: 1, branch_name: '' });
}

editBank(item:any){}
deleteBank(item:number){
  
}
}
