import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BCartComponent } from './b-cart.component';

describe('BCartComponent', () => {
  let component: BCartComponent;
  let fixture: ComponentFixture<BCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
