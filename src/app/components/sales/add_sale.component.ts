import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-sale.component.html',
})
export class AddSaleComponent implements OnInit {
  saleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.saleForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      // yaha aur fields add kar sakte ho (product, amount, etc.)
    });
  }

  submitSale() {
    if (this.saleForm.invalid) {
      alert('⚠️ Payment method is required!');
      return;
    }
    console.log('✅ Sale submitted:', this.saleForm.value);
  }
}
