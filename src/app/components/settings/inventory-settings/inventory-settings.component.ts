import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductCategory, WarehouseModel } from '../../../MODEL/MODEL';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-inventory-settings',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory-settings.component.html',
  styleUrl: './inventory-settings.component.css'
})
export class InventorySettingsComponent {
categoryForm: FormGroup;
  warehouseForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  showCategoryForm = false;
  showWarehouseForm = false;


  constructor(private fb: FormBuilder, private inventoryService: InventoryService) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['']
    });
    this.warehouseForm = this.fb.group({
      warehouseName: ['', Validators.required],
      isRefrigerated: [false],
      remark: ['']
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

   submitWarehouse() {
    if (this.warehouseForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const warehouseData: WarehouseModel = {
      warehouseName: this.warehouseForm.value.warehouseName,
      isRefrigerated: this.warehouseForm.value.isRefrigerated,
      remark: this.warehouseForm.value.remark,
    };

    this.inventoryService.AddWarehouse(warehouseData).subscribe({
      next: (res) => {
        this.successMessage = 'Warehouse added successfully!';
        this.warehouseForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to add warehouse. Please try again.';
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }
    
}
