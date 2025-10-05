import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ProductDTO } from '../../../DTO/DTO';
import { PaginationFilter } from '../../../MODEL/MODEL';
import { BarcodeService } from '../../../services/barcode.service';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-sold-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './sold-product.component.html',
  styleUrl: './sold-product.component.css'
})
export class SoldProductComponent {

   @ViewChild('productTable', { static: false }) productTable!: ElementRef;
  @ViewChildren('tooltipTarget') tooltipTargets!: QueryList<ElementRef>;
  @Input() products: ProductDTO[] = [];
  selectedBarcodes: string[] = [];
  barcode: string | null = null;
  barcodeText: string = '';
  totalRecords: number = 0;

  readonly today: string;
  filter: PaginationFilter;
  pageSizes: number[] = [10, 20, 50];
  reportIsLoading: boolean = false;

  private tooltips: Instance[] = [];

  constructor(
    private barcodeService: BarcodeService,
    private inventoryService: InventoryService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private alertservice: AlertService

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

 ngAfterViewInit(): void {
    // Run once after view init
    this.tooltipTargets.changes.subscribe(() => {
      this.initTooltips();
    });
  }


  getProductData() {
    this.inventoryService.GetSoldProducts(this.filter).subscribe({
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

  // 🔹 Export
  exportToPdf() {
    this.reportIsLoading = true;
    this.inventoryService.getSoldProductReportPdf(this.filter).subscribe(blob => {
      this.reportIsLoading = false;
      if (blob){
         this.inventoryService.downloadFile(blob, 'SoldProductReport.pdf');
        this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
      }
    });
  }

  exportToExcel() {
    this.reportIsLoading = true;
    this.inventoryService.getSoldProductReportExcel(this.filter).subscribe(blob => {
      this.reportIsLoading = false;
      if (blob){
         this.inventoryService.downloadFile(blob, 'SoldProductReport.xlsx');
         this.alertservice.showAlert("File Downloaded Successfully Inside Download Folder", 'success');
      }
    });
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

  // 🔹 Tooltips
   initTooltips() {
    // Destroy old tooltips
    this.tooltips.forEach(t => t.destroy());
    this.tooltips = [];

    this.ngZone.runOutsideAngular(() => {
      this.tooltipTargets.forEach(el => {
        const tip = tippy(el.nativeElement, {
          delay: [100, 100],
          arrow: true,
          theme: 'light',
        });
        this.tooltips.push(Array.isArray(tip) ? tip[0] : tip);
      });
    });
  }
}
