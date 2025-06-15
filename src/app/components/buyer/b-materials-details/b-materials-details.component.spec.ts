import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BMaterialsDetailsComponent } from './b-materials-details.component';

describe('BMaterialsDetailsComponent', () => {
  let component: BMaterialsDetailsComponent;
  let fixture: ComponentFixture<BMaterialsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BMaterialsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BMaterialsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
