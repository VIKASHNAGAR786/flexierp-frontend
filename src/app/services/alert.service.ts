import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: number; // unique ID for each alert
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();
  private counter = 0;

  // Show a new alert
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const id = this.counter++;
    const newAlert: Alert = { id, message, type };
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, newAlert]);

    // Auto remove after 4 seconds
    setTimeout(() => this.removeAlert(id), 4000);
  }

  // Remove alert by ID
  removeAlert(id: number) {
    const updatedAlerts = this.alertsSubject.value.filter(alert => alert.id !== id);
    this.alertsSubject.next(updatedAlerts);
  }

  // Handle backend responses
  handleBackendResponse(response: { success: boolean; message: string }) {
    if (response.success) {
      this.showAlert(response.message, 'success');
    } else {
      this.showAlert(response.message || 'Something went wrong!', 'error');
    }
  }
}
