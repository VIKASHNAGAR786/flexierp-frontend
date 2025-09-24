import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, AfterViewChecked, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarcodeService } from '../../../services/barcode.service';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { InventoryService } from '../../../services/inventory.service';
import { ProductDTO } from '../../../DTO/DTO';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, AfterViewChecked {
   @ViewChild('productTable', { static: false }) productTable!: ElementRef;
  @Input() products: ProductDTO[] = [];
  selectedBarcodes: string[] = [];
  barcode: string | null = null;
  barcodeText: string = '';
  totalRecords: number = 0;

  readonly today: string;
  filter: PaginationFilter;
  pageSizes: number[] = [10, 20, 50];

  private tooltips: Instance[] = [];

  constructor(
    private barcodeService: BarcodeService,
    private inventoryService: InventoryService,
    private ngZone: NgZone
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

  ngAfterViewChecked(): void {
  }

  getProductData() {
    this.inventoryService.GetProducts(this.filter).subscribe({
      next: (data) => {
        if (data) {
          this.products = data;
          this.totalRecords = data.length > 0 ? data[0].totalRecords : 0;
          setTimeout(() => this.initTooltips(), 0); // initialize after DOM renders
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

  // 🔹 Export
  exportToPdf() { console.log('Export PDF with filter', this.filter); }
  exportToExcel() { console.log('Export Excel with filter', this.filter); }

  // 🔹 Barcode
  getBarcode(text: string): void {
    this.barcodeService.generateBarcode(text, 'code128', 0.3, 20)
      .subscribe({
        next: (blob) => {
          this.barcode = URL.createObjectURL(blob);
        },
        error: (err) => console.error('Error fetching barcode', err)
      });
  }

  showBarcode(barcode: string) {
    this.barcodeText = barcode;
    this.getBarcode(barcode);
  }

  // 🔹 Selection
  toggleAll(event: any) {
    const checked = event.target.checked;
    this.selectedBarcodes = checked ? this.products.map(p => p.barCode) : [];
  }

  toggleSelection(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedBarcodes.push(value);
    } else {
      this.selectedBarcodes = this.selectedBarcodes.filter(b => b !== value);
    }
  }

  generateBarcodePDF() {
    if (!this.selectedBarcodes.length) return;

    this.barcodeService.generateBarcodePDF(this.selectedBarcodes).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'barcodes.pdf';
        link.click();
      },
      error: (err) => console.error('Error generating PDF', err)
    });
  }

  // 🔹 Tooltips
  initTooltips() {
    if (!this.productTable) return;

    // Destroy old tooltips
    this.tooltips.forEach(t => t.destroy());
    this.tooltips = [];

    // Run outside Angular to avoid change detection issues
    this.ngZone.runOutsideAngular(() => {
      const elements = this.productTable.nativeElement.querySelectorAll('[data-tippy-content]');
      elements.forEach((el: HTMLElement) => {
        const tip = tippy(el, {
          delay: [100, 100],
          arrow: true,
          theme: 'light',
        });
        this.tooltips.push(tip);
      });
    });
  }
}
