
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProviderModel } from '../../../MODEL/MODEL';
import { InventoryService } from '../../../services/inventory.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent {
 isSubmitting = false; // 🔑 button disable flag
  provider: ProviderModel = {
    providerName: '',
    providerType: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    providerAddress: '',
    city: '',
    state: '',
    country: '',
    paymentTerms: '',
  };

  constructor(
    private inventoryService: InventoryService,
    private alertService: AlertService

  ) {}

    async submitProvider() {
  if (this.isSubmitting) return; // prevent double clicks

  this.isSubmitting = true; // disable button

  try {
    const res = await this.inventoryService.AddProvider(this.provider).toPromise();
    this.alertService.showAlert('Provider added successfully!', 'success');
    this.resetForm();
  } catch (err) {
    this.alertService.showAlert('Failed to save provider. Try again.', 'error');
    console.error('Error saving provider:', err);
  } finally {
    this.isSubmitting = false; // always enable button again
  }
}

  resetForm() {
    this.provider = {
      providerName: '',
      providerType: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      providerAddress: '',
      city: '',
      state: '',
      country: '',
      paymentTerms: '',
    };
  }
}
