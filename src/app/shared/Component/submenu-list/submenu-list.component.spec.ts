import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuListComponent } from './submenu-list.component';

describe('SubmenuListComponent', () => {
  let component: SubmenuListComponent;
  let fixture: ComponentFixture<SubmenuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmenuListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
