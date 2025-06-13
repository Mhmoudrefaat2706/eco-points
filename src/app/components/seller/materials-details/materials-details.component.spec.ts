import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsDetailsComponent } from './materials-details.component';

describe('MaterialsDetailsComponent', () => {
  let component: MaterialsDetailsComponent;
  let fixture: ComponentFixture<MaterialsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
