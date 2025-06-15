import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BNotFoundComponent } from './b-not-found.component';

describe('BNotFoundComponent', () => {
  let component: BNotFoundComponent;
  let fixture: ComponentFixture<BNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
