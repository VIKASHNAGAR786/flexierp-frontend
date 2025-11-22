import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { on } from 'events';

@Component({
  selector: 'app-banktransferpopup',
  imports: [CommonModule, FormsModule],
  templateUrl: './banktransferpopup.component.html',
  styleUrl: './banktransferpopup.component.css'
})
export class BanktransferpopupComponent implements OnInit{

  ngOnInit(): void {
    this.transfer.currency = 'INR';
  }
  @Input() show: boolean = false;
  @Input() transfer: any = {};

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit(); // parent will hide popup
  }

  saveTransfer() {
    this.save.emit(this.transfer); // send data to parent
  }
}
