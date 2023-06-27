import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBackListComponent } from './call-back-list.component';

describe('CallBackListComponent', () => {
  let component: CallBackListComponent;
  let fixture: ComponentFixture<CallBackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallBackListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallBackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
