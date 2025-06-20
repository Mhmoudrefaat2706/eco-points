import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BFeadbackComponent } from './b-feadback.component';

describe('BFeadbackComponent', () => {
  let component: BFeadbackComponent;
  let fixture: ComponentFixture<BFeadbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BFeadbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BFeadbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
