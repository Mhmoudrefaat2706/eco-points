import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BMaterialsComponent } from './b-materials.component';

describe('BMaterialsComponent', () => {
  let component: BMaterialsComponent;
  let fixture: ComponentFixture<BMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
