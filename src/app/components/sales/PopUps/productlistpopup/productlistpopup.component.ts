import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDTO } from '../../../../DTO/DTO';
import { PaginationFilter } from '../../../../MODEL/MODEL';
import { BarcodeService } from '../../../../services/barcode.service';
import { InventoryService } from '../../../../services/inventory.service';

@Component({
  selector: 'app-productlistpopup',
  imports: [CommonModule, FormsModule],
  templateUrl: './productlistpopup.component.html',
  styleUrl: './productlistpopup.component.css'
})
export class ProductlistpopupComponent implements OnInit {
@Input() showProductList = false;
  @Output() close = new EventEmitter<void>();
  @Output() selectProduct = new EventEmitter<any>(); // <-- emits product row

  onClose() {
    this.close.emit();
  }
  onRowClick(product: any) {
    this.selectProduct.emit(product); // emit full product or just product.barCode
    this.onClose(); // also close popup after selecting
  }
  @Input() products: ProductDTO[] = [];
  selectedBarcodes: string[] = [];
  barcode: string | null = null;
  barcodeText: string = '';
  totalRecords: number = 0;

  readonly today: string;
  filter: PaginationFilter;
  pageSizes: number[] = [10, 20, 50];
  reportIsLoading: boolean = false;

  constructor(
    private barcodeService: BarcodeService,
    private inventoryService: InventoryService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef

  ) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    this.today = `${yyyy}-${mm}-${dd}`;
    this.filter = {
      startDate: this.today,
      endDate: this.today,
      searchTerm: '',
      pageNo: 1,
      pageSize: 10
    };
  }

  ngOnInit(): void {
    this.getProductData();
  }

  getProductData() {
    this.inventoryService.GetProducts(this.filter).subscribe({
      next: (data) => {
        if (data) {
          this.products = data;
          this.totalRecords = data.length > 0 ? data[0].totalRecords : 0;
         this.cdr.detectChanges(); // force Angular to render table rows
        }
      },
      error: (err) => console.error(err)
    });
  }

  // 🔹 Pagination
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.filter.pageSize) || 1;
  }

  nextPage() {
    if (this.filter.pageNo < this.totalPages) {
      this.filter.pageNo++;
      this.getProductData();
    }
  }

  prevPage() {
    if (this.filter.pageNo > 1) {
      this.filter.pageNo--;
      this.getProductData();
    }
  }

  // 🔹 Selection
  // toggleAll(event: any) {
  //   const checked = event.target.checked;
  //   this.selectedBarcodes = checked ? this.products.map(p => p.barCode) : [];
  // }

  // toggleSelection(event: any) {
  //   const value = event.target.value;
  //   if (event.target.checked) {
  //     this.selectedBarcodes.push(value);
  //   } else {
  //     this.selectedBarcodes = this.selectedBarcodes.filter(b => b !== value);
  //   }
  // }

  // generateBarcodePDF() {
  //   if (!this.selectedBarcodes.length) return;

  //   this.barcodeService.generateBarcodePDF(this.selectedBarcodes).subscribe({
  //     next: (blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = 'barcodes.pdf';
  //       link.click();
  //     },
  //     error: (err) => console.error('Error generating PDF', err)
  //   });
  // }

}
