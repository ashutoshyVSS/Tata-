import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionMasterComponent } from './position-master.component';

describe('PositionMasterComponent', () => {
  let component: PositionMasterComponent;
  let fixture: ComponentFixture<PositionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
