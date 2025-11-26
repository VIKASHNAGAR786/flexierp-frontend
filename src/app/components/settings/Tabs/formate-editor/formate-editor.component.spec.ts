import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormateEditorComponent } from './formate-editor.component';

describe('FormateEditorComponent', () => {
  let component: FormateEditorComponent;
  let fixture: ComponentFixture<FormateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormateEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
