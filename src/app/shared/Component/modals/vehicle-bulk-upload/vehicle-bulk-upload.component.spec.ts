import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBulkUploadComponent } from './vehicle-bulk-upload.component';

describe('VehicleBulkUploadComponent', () => {
  let component: VehicleBulkUploadComponent;
  let fixture: ComponentFixture<VehicleBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
