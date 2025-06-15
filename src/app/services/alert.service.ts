import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface BackendResponse {
  success: boolean;
  message: string;
}
@Injectable({
  providedIn: 'root',
})

export class AlertService {
  private alertSubject = new BehaviorSubject<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  alert$ = this.alertSubject.asObservable();

  // Show alert with message and type
  showAlert(message: string, type: 'success' | 'error') {
    console.log('🔴 Emitting alert:', { message, type });
    this.alertSubject.next({ message, type });

    // Clear alert after 3 seconds
    setTimeout(() => {
      console.log('🟢 Hiding alert');
      this.alertSubject.next({ message: '', type: null });  // Clears alert after 3 seconds
    }, 3000);
  }

  // This method will be used to show messages from the backend (success or error)
  handleBackendResponse(response: BackendResponse) {
    if (response.success) {
      // If the backend indicates success
      this.showAlert(response.message, 'success');
    } else {
      // If the backend indicates failure
      this.showAlert(response.message || 'Something went wrong!', 'error');
    }
  }
}
