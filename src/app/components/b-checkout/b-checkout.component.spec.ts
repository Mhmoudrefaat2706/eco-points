import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BCheckoutComponent } from './b-checkout.component';

describe('BCheckoutComponent', () => {
  let component: BCheckoutComponent;
  let fixture: ComponentFixture<BCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
