import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="alertData.message"
      class="fixed z-[9999] right-5 top-[90px] max-w-sm w-auto px-6 py-4 rounded-lg shadow-2xl text-white transition-all duration-300 animate-fade-top"
      [ngClass]="{
        'bg-green-600': alertData.type === 'success',
        'bg-red-600': alertData.type === 'error',
        'bg-yellow-500': alertData.type === 'warning',
        'bg-blue-600': alertData.type === 'info'
      }"
    >
      <span class="font-semibold tracking-wide text-sm sm:text-base">
        {{ alertData.message }}
      </span>
    </div>
  `,
  styles: [`
    @keyframes fadeTop {
      0% { opacity: 0; transform: translateY(-20px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
    .animate-fade-top {
      animation: fadeTop 4s ease-in-out forwards;
    }
  `]
})
export class AlertComponent {
  alertData = { message: '', type: 'success' as 'success' | 'error' | 'warning' | 'info' | null };

  constructor(private alertService: AlertService) {
    this.alertService.alert$.subscribe((data) => {
      console.log('🟡 Alert received:', data);
      this.alertData = data;
    });
  }
}
