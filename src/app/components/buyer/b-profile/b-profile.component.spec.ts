import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BProfileComponent } from './b-profile.component';

describe('BProfileComponent', () => {
  let component: BProfileComponent;
  let fixture: ComponentFixture<BProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
