import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersToMeComponent } from './orders-to-me.component';

describe('OrdersToMeComponent', () => {
  let component: OrdersToMeComponent;
  let fixture: ComponentFixture<OrdersToMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersToMeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersToMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
