import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadListDetailsComponent } from './lead-list-details.component';

describe('LeadListDetailsComponent', () => {
  let component: LeadListDetailsComponent;
  let fixture: ComponentFixture<LeadListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadListDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
