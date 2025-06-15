import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorserviceService {

  constructor() { }
private selectedColorSubject = new BehaviorSubject<string>('#FFFFFF'); // default color
selectedColor$ = this.selectedColorSubject.asObservable();

setColor(color: string): void {
  this.selectedColorSubject.next(color);
}
getColor(): string {
  return this.selectedColorSubject.getValue();
}
}
