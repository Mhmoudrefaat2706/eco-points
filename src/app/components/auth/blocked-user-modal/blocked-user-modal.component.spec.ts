import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedUserModalComponent } from './blocked-user-modal.component';

describe('BlockedUserModalComponent', () => {
  let component: BlockedUserModalComponent;
  let fixture: ComponentFixture<BlockedUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockedUserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockedUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
