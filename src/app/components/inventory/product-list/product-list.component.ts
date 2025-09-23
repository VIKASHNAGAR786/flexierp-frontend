import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarcodeService } from '../../../services/barcode.service';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  constructor(private barcodeService: BarcodeService) {}
dateFrom: string = '';
dateTo: string = '';
allProducts: any[] = [];   // keep original list
  ngOnInit(): void {
   // this.getBarcode();
   this.allProducts = this.products; // assume products come from service
   this.filteredProducts = [...this.allProducts];
   this.applyFilter();

  }
  ngAfterViewInit() {
  this.initTooltips();
}

selectedBarcodes: string[] = [];
  barcode: string | null = null;
  @Input() products: any[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  pageSizes: number[] = [5, 10, 20];
  filteredProducts: any[] = [];


  ngOnChanges() {
    this.applyFilter();
  }

  applyFilter() {
    this.filteredProducts = this.products.filter(p =>
      Object.values(p).some(val =>
        String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
    this.currentPage = 1; // reset to first page
    setTimeout(() => this.initTooltips(), 0); // Re-initialize tooltips
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  exportToPdf() {
    // Implement PDF export logic here
    console.log('Exporting to PDF...');
  }

    exportToExcel() {
    // Implement PDF export logic here
    console.log('Exporting to PDF...');
  }


  getBarcode(text: string): void {
  this.barcodeService.generateBarcode(text, 'code128', 0.3, 20)
    .subscribe({
      next: (blob) => {
        // Convert Blob to Object URL for <img> tag
        this.barcode = URL.createObjectURL(blob);
        console.log('Barcode generated successfully', this.barcode);
      },
      error: (err) => console.error('Error fetching barcode', err)
    });
}

barcodeText: string = ''; // variable to store clicked barcode

showBarcode(barcode: string) {
  this.barcodeText = barcode;
  // You can also call your barcode service here if needed
  this.getBarcode(barcode);
}

toggleAll(event: any) {
  const checked = event.target.checked;
  if (checked) {
    this.selectedBarcodes = this.filteredProducts.map(p => p.barcode);
  } else {
    this.selectedBarcodes = [];
  }
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

initTooltips() {
  // Destroy any existing tooltips to avoid duplicates
  tippy('[data-tippy-content]', {
    // Optional: you can set default options here
    delay: [100, 100],
    arrow: true,
    theme: 'light',
  });
}

applyDateFilter() {
  if (!this.dateFrom && !this.dateTo) {
    this.filteredProducts = [...this.allProducts]; // reset if no filter
    return;
  }

  const from = this.dateFrom ? new Date(this.dateFrom) : null;
  const to = this.dateTo ? new Date(this.dateTo) : null;

  this.filteredProducts = this.allProducts.filter(p => {
    const packedDate = new Date(p.packedDate); // make sure `packedDate` exists
    if (from && packedDate < from) return false;
    if (to && packedDate > to) return false;
    return true;
  });
}

}
