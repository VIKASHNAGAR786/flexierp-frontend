import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {

  private current: 'dark' | 'light' = 'dark';

  constructor() {
    const saved = localStorage.getItem('theme');
    this.current = saved === 'light' ? 'light' : 'dark';
    this.applyTheme();
  }

  get currentTheme() {
    return this.current;
  }

  setTheme(theme: 'dark' | 'light') {
    this.current = theme;
    this.applyTheme();
    localStorage.setItem('theme', theme);
  }

  private applyTheme() {
    const html = document.documentElement;
    html.classList.remove('dark-theme', 'light-theme');  
    html.classList.add(this.current + '-theme');
  }
}
