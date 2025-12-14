
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cheque-popup',
  imports: [FormsModule],
  templateUrl: './cheque-popup.component.html',
  styleUrl: './cheque-popup.component.css'
})
export class ChequePopupComponent {

  @Input() show: boolean = false;
  @Input() cheque: any = {};

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit(); // parent will hide popup
  }

  saveCheque() {
    this.save.emit(this.cheque); // send data to parent
  }
}
