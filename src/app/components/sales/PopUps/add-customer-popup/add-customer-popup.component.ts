import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-customer-popup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-customer-popup.component.html',
  styleUrls: ['./add-customer-popup.component.css']
})
export class AddCustomerPopupComponent {

  @Input() isOpen: boolean = false;

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<any>();

  customer = {
    customerName: '',
    email: '',
    phoneNo: '',
    customerAddress: ''
  };

  onSave() {
    if (
      this.customer.customerName.length >= 3 &&
      this.customer.email &&
      this.customer.phoneNo.length === 10 &&
      this.customer.customerAddress
    ) {
      this.save.emit(this.customer);
    }
  }

  onClose() {
    this.close.emit();
  }
}
