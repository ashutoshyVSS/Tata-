import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqAddEditComponent } from './faq-add-edit.component';

describe('FaqAddEditComponent', () => {
  let component: FaqAddEditComponent;
  let fixture: ComponentFixture<FaqAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
