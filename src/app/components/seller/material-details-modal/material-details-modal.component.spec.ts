import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDetailsModalComponent } from './material-details-modal.component';

describe('MaterialDetailsModalComponent', () => {
  let component: MaterialDetailsModalComponent;
  let fixture: ComponentFixture<MaterialDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
