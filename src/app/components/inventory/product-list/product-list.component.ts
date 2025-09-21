import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  @Input() products: any[] = [];

  searchTerm: string = '';
currentPage: number = 1;
itemsPerPage: number = 5;
pageSizes: number[] = [5, 10, 20];
filteredProducts: any[] = [];

ngOnInit() {
  this.applyFilter();
}

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
}
