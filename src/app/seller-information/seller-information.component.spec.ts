import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerInformationComponent } from './seller-information.component';

describe('SellerInformationComponent', () => {
  let component: SellerInformationComponent;
  let fixture: ComponentFixture<SellerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
