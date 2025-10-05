import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../services/inventory.service';
import { ProductCategoryDTO, WarehouseDTO } from '../../../DTO/DTO';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
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
      productCategory: [null, Validators.required],
      productType: [''],
      packedDate: [null],
      packedWeight: [null, [Validators.required, Validators.min(0)]],
      packedHeight: [null, [Validators.required, Validators.min(0)]],
      packedWidth: [null,  [Validators.required, Validators.min(0)]],
      packedDepth: [null,  [Validators.required, Validators.min(0)]],
      isPerishable: [false],
      purchasePrice: [null, [Validators.required, Validators.min(0)]],  // 👈 no negative
      sellingPrice: [null, [Validators.required, Validators.min(0)]],   // 👈 no negative
      taxpr: [null, [Validators.min(0)]],                             // 👈 no negative
      discounpr: [null, [Validators.min(0)]],                            // 👈 no negative
      productDescription: [''],
      reorderQuantity: [null, [Validators.min(0)]],                     // 👈 no negative
      warehouseID: [null],
      warehouseName: [''],
      warehouseRefrigerated: [false],
      productQunatity: [null, [Validators.min(0)]], // 👈 no negative
      taxRate:0,
      discount:0,
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
          productCategory: '',
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
          taxpr: 0,
          discounpr: 0,
          productDescription: '',
          reorderQuantity: 0,
          warehouseID: 0,
          warehouseName: '',
          warehouseRefrigerated: false,
         taxRate:0,
      discount:0,

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

  // Called when Tax Rate changes
onTaxChange(taxpr: number) {
  const sellingPrice = this.productForm.get('sellingPrice')?.value ?? 0;

  // Ensure no negative values
  const rate = taxpr < 0 ? 0 : taxpr;

  // Calculate Tax Amount (per quantity)
  const taxAmt = (sellingPrice  * rate) / 100;

  // Update form
  this.productForm.patchValue({
    taxRate: taxAmt
  });
}

onDiscountChange(discounpr: number) {
  const sellingPrice = this.productForm.get('sellingPrice')?.value ?? 0;

  const rate = discounpr < 0 ? 0 : discounpr;

  // Calculate Discount Amount (per quantity)
  const discountAmt = (sellingPrice  * rate) / 100;

  // Update form
  this.productForm.patchValue({
    discount: discountAmt
  });
}

}
