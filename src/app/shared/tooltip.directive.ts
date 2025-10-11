import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';
  @Input() tooltipPosition: TooltipPosition = 'bottom';
  @Input() tooltipColor = '#00ffee';
  @Input() tooltipBgColor = 'rgba(0,0,0,0.85)';
  @Input() tooltipDelay = 0;
  @Input() tooltipFixed = true; // allow override

  private tooltipElement?: HTMLElement;
  private showTimeout?: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;

    const useFixed = this.tooltipFixed && !this.isInsideFixedContainer();

    this.showTimeout = setTimeout(() => {
      this.createTooltip(useFixed);
      this.setPosition(useFixed);
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave') onMouseLeave() {
    clearTimeout(this.showTimeout);
    if (this.tooltipElement) {
      this.renderer.removeChild(this.getContainer(this.tooltipFixed), this.tooltipElement);
      this.tooltipElement = undefined;
    }
  }

  private isInsideFixedContainer(): boolean {
    let parent = this.el.nativeElement.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (style.position === 'fixed') return true;
      parent = parent.parentElement;
    }
    return false;
  }

  private createTooltip(useFixed: boolean) {
    this.tooltipElement = this.renderer.createElement('div');
    if (this.tooltipElement) {
      this.tooltipElement.innerText = this.tooltipText;
      this.renderer.addClass(this.tooltipElement, 'tooltip-box');
    }

    this.renderer.setStyle(this.tooltipElement, 'position', useFixed ? 'fixed' : 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', this.tooltipBgColor);
    this.renderer.setStyle(this.tooltipElement, 'color', this.tooltipColor);
    this.renderer.setStyle(this.tooltipElement, 'padding', '4px 8px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '6px');
    this.renderer.setStyle(this.tooltipElement, 'fontSize', '12px');
    this.renderer.setStyle(this.tooltipElement, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'pointerEvents', 'none');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '9999');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease');

    this.renderer.appendChild(this.getContainer(useFixed), this.tooltipElement);
  }

  private getContainer(useFixed: boolean): HTMLElement {
    return useFixed ? document.body : this.el.nativeElement.offsetParent || this.el.nativeElement.parentElement;
  }

  private setPosition(useFixed: boolean) {
    if (!this.tooltipElement) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const spacing = 6;
    let top = 0;
    let left = 0;

    if (useFixed) {
      switch (this.tooltipPosition) {
        case 'top':
          top = rect.top - tooltipRect.height - spacing;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + spacing;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - spacing;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + spacing;
          break;
      }

      const margin = 5;
      if (left < margin) left = margin;
      if (left + tooltipRect.width > window.innerWidth - margin) {
        left = window.innerWidth - tooltipRect.width - margin;
      }
      if (top < margin) top = margin;
      if (top + tooltipRect.height > window.innerHeight - margin) {
        top = window.innerHeight - tooltipRect.height - margin;
      }
    } else {
      const offsetTop = this.el.nativeElement.offsetTop;
      const offsetLeft = this.el.nativeElement.offsetLeft;

      switch (this.tooltipPosition) {
        case 'top':
          top = offsetTop - tooltipRect.height - spacing;
          left = offsetLeft + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = offsetTop + rect.height + spacing;
          left = offsetLeft + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = offsetTop + rect.height / 2 - tooltipRect.height / 2;
          left = offsetLeft - tooltipRect.width - spacing;
          break;
        case 'right':
          top = offsetTop + rect.height / 2 - tooltipRect.height / 2;
          left = offsetLeft + rect.width + spacing;
          break;
      }
    }

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }
}