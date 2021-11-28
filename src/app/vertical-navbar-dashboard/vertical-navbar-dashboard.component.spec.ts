import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavbarDashboardComponent } from './vertical-navbar-dashboard.component';

describe('VerticalNavbarDashboardComponent', () => {
  let component: VerticalNavbarDashboardComponent;
  let fixture: ComponentFixture<VerticalNavbarDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalNavbarDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalNavbarDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
