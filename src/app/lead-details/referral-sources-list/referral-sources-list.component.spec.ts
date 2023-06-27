import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralSourcesListComponent } from './referral-sources-list.component';

describe('ReferralSourcesListComponent', () => {
  let component: ReferralSourcesListComponent;
  let fixture: ComponentFixture<ReferralSourcesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralSourcesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralSourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
