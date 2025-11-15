import { Directive } from '@angular/core';
import { ThemeServiceService } from '../services/theme-service.service';

@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective {
  constructor(private theme: ThemeServiceService) {
    // Directive automatically triggers theme on load
  }
}
