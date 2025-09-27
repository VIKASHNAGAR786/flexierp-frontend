import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../services/inventory.service';
import { ProductCategoryDTO, WarehouseDTO } from '../../../DTO/DTO';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent {
  @Output() productAdded = new EventEmitter<any>();
  productForm!: FormGroup;
  categories: ProductCategoryDTO[] = [];
  warehouses: WarehouseDTO[] = [];
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productCategory: [0, Validators.required],
      productType: [''],
      packedDate: [null],
      packedWeight: [null],
      packedHeight: [null],
      packedWidth: [null],
      packedDepth: [null],
      isPerishable: [false],
      purchasePrice: [0],
      sellingPrice: [0],
      taxRate: [0],
      discount: [0],
      productDescription: [''],
      reorderQuantity: [0],
      warehouseID: [0],
      warehouseName: [''],
      warehouseRefrigerated: [false],
    });

    this.loadCategories();
    this.loadWarehouses();
  }

  addProduct() {
    if (this.productForm.invalid) {
      this.alertService.showAlert('⚠️ Please fill required fields.', 'warning');
      return;
    }

    const product = this.productForm.value; // <-- automatically matches ProductModel
    this.inventoryService.AddProduct(product).subscribe({
      next: (res) => {
        this.alertService.showAlert('✅ Product added successfully!', 'success');
        this.productAdded.emit(res);
        this.productForm.reset({
          productName: '',
          productCategory: 0,
          productType: '',
          packedDate: null,
          packedWeight: null,
          packedHeight: null,
          packedWidth: null,
          packedDepth: null,
          isPerishable: false,
          createdBy: 1,
          purchasePrice: 0,
          sellingPrice: 0,
          taxRate: 0,
          discount: 0,
          productDescription: '',
          reorderQuantity: 0,
          warehouseID: 0,
          warehouseName: '',
          warehouseRefrigerated: false,
        });
      },
      error: (err) => {
        this.alertService.showAlert('Failed to add product.', 'error');
      }
    });
  }

  loadCategories(): void {
    this.inventoryService.GetCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadWarehouses(): void {
    this.inventoryService.GetWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data || [];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
