import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BNavbarComponent } from './b-navbar.component';

describe('BNavbarComponent', () => {
  let component: BNavbarComponent;
  let fixture: ComponentFixture<BNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
