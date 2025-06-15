import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BAboutComponent } from './b-about.component';

describe('BAboutComponent', () => {
  let component: BAboutComponent;
  let fixture: ComponentFixture<BAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
