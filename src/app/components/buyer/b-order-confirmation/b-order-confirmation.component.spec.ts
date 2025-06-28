import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BOrderConfirmationComponent } from './b-order-confirmation.component';

describe('BOrderConfirmationComponent', () => {
  let component: BOrderConfirmationComponent;
  let fixture: ComponentFixture<BOrderConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BOrderConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BOrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
