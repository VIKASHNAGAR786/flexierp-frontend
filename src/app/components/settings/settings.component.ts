import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCategory } from '../../MODEL/MODEL';
import { InventoryService } from '../../services/inventory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  categoryForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private inventoryService: InventoryService) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['']
    });
  }

  submitCategory() {
    if (this.categoryForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const categoryData: ProductCategory = {
      categoryName: this.categoryForm.value.categoryName,
      description: this.categoryForm.value.description
    };

    this.inventoryService.saveProductCategory(categoryData).subscribe({
      next: (res) => {
        this.successMessage = 'Category added successfully!';
        this.categoryForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to add category. Please try again.';
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }
}
