import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialAddEditComponent } from './testimonial-add-edit.component';

describe('TestimonialAddEditComponent', () => {
  let component: TestimonialAddEditComponent;
  let fixture: ComponentFixture<TestimonialAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
