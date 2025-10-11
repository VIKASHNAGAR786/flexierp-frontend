import { TooltipDirective } from './tooltip.directive';

describe('TooltipDirective', () => {
  it('should create an instance', () => {
    // Create mock ElementRef and Renderer2
    const mockElementRef = { nativeElement: {} } as any;
    const mockRenderer2 = {
      addClass: () => {},
      removeClass: () => {},
      setStyle: () => {},
      removeStyle: () => {},
      listen: () => () => {},
    } as any;
    const directive = new TooltipDirective(mockElementRef, mockRenderer2);
    expect(directive).toBeTruthy();
  });
});
