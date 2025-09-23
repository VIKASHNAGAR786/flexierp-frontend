import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarcodeService } from '../../../services/barcode.service';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { PaginationFilter } from '../../../MODEL/MODEL';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit , OnChanges
{
  constructor(private barcodeService: BarcodeService) {}

  @Input() products: any[] = [];
  allProducts: any[] = [];
  filteredProducts: any[] = [];

  // ✅ unified filter object
  filter: PaginationFilter = {
  startDate: new Date().toISOString().split('T')[0], // today in YYYY-MM-DD format
  endDate: new Date().toISOString().split('T')[0],   // today in YYYY-MM-DD format
  searchTerm: '',
  pageNo: 1,
  pageSize: 5
};
  pageSizes: number[] = [5, 10, 20];
  selectedBarcodes: string[] = [];
  barcode: string | null = null;
  barcodeText: string = '';

  ngOnInit(): void {
    this.allProducts = this.products;
    this.filteredProducts = [...this.allProducts];
    this.applyFilter();
  }

  ngOnChanges() {
    this.applyFilter();
  }

  // 🔹 Apply all filters: search + date + pagination
  applyFilter() {
    // const term = this.filter.searchTerm.toLowerCase();

    // this.filteredProducts = this.allProducts.filter(p => {
    //   // Search filter
    //   const matchesSearch = Object.values(p).some(val =>
    //     String(val).toLowerCase().includes(term)
    //   );

    //   // Date filter
    //   const from = this.filter.startDate ? new Date(this.filter.startDate) : null;
    //   const to = this.filter.endDate ? new Date(this.filter.endDate) : null;
    //   const packedDate = p.packedDate ? new Date(p.packedDate) : null;

    //   const matchesDate =
    //     (!from || (packedDate && packedDate >= from)) &&
    //     (!to || (packedDate && packedDate <= to));
    //     console.log(from, to, packedDate, matchesDate, this.filter);
    //   return matchesSearch && matchesDate;
    // });

    console.log(this.filter);
    this.filter.pageNo = 1; // reset to first page
    setTimeout(() => this.initTooltips(), 0);
  }

  // 🔹 Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.filter.pageSize) || 1;
  }

  nextPage() {
    if (this.filter.pageNo < this.totalPages) this.filter.pageNo++;
  }

  prevPage() {
    if (this.filter.pageNo > 1) this.filter.pageNo--;
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
    this.selectedBarcodes = checked
      ? this.filteredProducts.map(p => p.barcode)
      : [];
    setTimeout(() => this.initTooltips(), 0);
  }

  toggleSelection(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedBarcodes.push(value);
    } else {
      this.selectedBarcodes = this.selectedBarcodes.filter(b => b !== value);
    }
    setTimeout(() => this.initTooltips(), 0);
  }

  generateBarcodePDF() {
    if (this.selectedBarcodes.length === 0) return;

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
    tippy('[data-tippy-content]', {
      delay: [100, 100],
      arrow: true,
      theme: 'light',
    });
  }
}