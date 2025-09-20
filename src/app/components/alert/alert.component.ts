import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html'
})
export class AlertComponent {
  alerts: Alert[] = [];
  progressMap: { [id: number]: number } = {};
  timers: { [id: number]: any } = {};

  constructor(private alertService: AlertService) {
    // Subscribe to alert array
    this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;

      // Start timer for new alerts
      alerts.forEach(alert => {
        if (!this.timers[alert.id]) this.startTimer(alert.id);
      });
    });
  }

  startTimer(id: number) {
    this.progressMap[id] = 100;
    const duration = 4000; // 4 seconds
    const interval = 50;
    const step = (interval / duration) * 100;

    this.timers[id] = setInterval(() => {
      this.progressMap[id] -= step;
      if (this.progressMap[id] <= 0) {
        this.progressMap[id] = 0;
        clearInterval(this.timers[id]);
        this.closeAlert(id);
      }
    }, interval);
  }

  closeAlert(id: number) {
    clearInterval(this.timers[id]);
    delete this.timers[id];
    delete this.progressMap[id];
    this.alertService.removeAlert(id);
  }

  getAlertClasses(type: string) {
    switch(type) {
      case 'success': return ['bg-gradient-to-r', 'from-green-600', 'to-green-700'];
      case 'error': return ['bg-gradient-to-r', 'from-red-600', 'to-red-700'];
      case 'warning': return ['bg-gradient-to-r', 'from-yellow-500', 'to-yellow-600'];
      case 'info': return ['bg-gradient-to-r', 'from-blue-600', 'to-blue-700'];
      default: return ['bg-gray-600'];
    }
  }

  getProgressColor(type: string): string {
    switch(type) {
      case 'success': return '#34D399'; // green
      case 'error': return '#F87171';   // red
      case 'warning': return '#FBBF24'; // yellow
      case 'info': return '#60A5FA';    // blue
      default: return '#ffffff';
    }
  }

  getIconColor(type: string): string {
  switch(type) {
    case 'success': return '#10B981'; // green
    case 'error': return '#EF4444';   // red
    case 'warning': return '#F59E0B'; // yellow/orange
    case 'info': return '#3B82F6';    // blue
    default: return '#FFFFFF';        // fallback
  }
}
}
