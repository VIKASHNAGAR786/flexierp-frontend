import {
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ColorserviceService } from '../../services/colorservice.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeServiceService } from '../../services/theme-service.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  imports: [
    FormsModule,CommonModule
  ],
  styleUrls: ['./design.component.css']
})
export class DesignComponent  {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
   public colorService: ColorserviceService,
   public themeService: ThemeServiceService
  ) { }
  selectedColor: string = ''; // defght, 0.1, 20nis

  get currentTheme() {
  return this.themeService.currentTheme;
}

}
