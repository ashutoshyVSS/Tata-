import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotspotComponent } from './add-hotspot.component';

describe('AddHotspotComponent', () => {
  let component: AddHotspotComponent;
  let fixture: ComponentFixture<AddHotspotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHotspotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHotspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
