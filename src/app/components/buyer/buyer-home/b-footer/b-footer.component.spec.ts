import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BFooterComponent } from './b-footer.component';

describe('BFooterComponent', () => {
  let component: BFooterComponent;
  let fixture: ComponentFixture<BFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
