import {
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ColorserviceService } from '../../services/colorservice.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  imports: [
    FormsModule,
  ],
  styleUrls: ['./design.component.css']
})
export class DesignComponent  {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public colorService: ColorserviceService) { }
  selectedColor: string = ''; // defght, 0.1, 20nis

}
