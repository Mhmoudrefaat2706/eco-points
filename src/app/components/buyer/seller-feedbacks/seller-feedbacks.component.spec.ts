import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerFeedbacksComponent } from './seller-feedbacks.component';

describe('SellerFeedbacksComponent', () => {
  let component: SellerFeedbacksComponent;
  let fixture: ComponentFixture<SellerFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerFeedbacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
