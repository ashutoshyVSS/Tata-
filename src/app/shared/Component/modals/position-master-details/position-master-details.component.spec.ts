import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMasterDetailsComponent } from './position-master-details.component';

describe('PositionMasterDetailsComponent', () => {
  let component: PositionMasterDetailsComponent;
  let fixture: ComponentFixture<PositionMasterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionMasterDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
