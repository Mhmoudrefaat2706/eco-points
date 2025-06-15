import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BContactComponent } from './b-contact.component';

describe('BContactComponent', () => {
  let component: BContactComponent;
  let fixture: ComponentFixture<BContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
