import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDownloadPopupComponent } from './report-download-popup.component';

describe('ReportDownloadPopupComponent', () => {
  let component: ReportDownloadPopupComponent;
  let fixture: ComponentFixture<ReportDownloadPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDownloadPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDownloadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
