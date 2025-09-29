import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRecycle } from './booking-recycle';

describe('BookingRecycle', () => {
  let component: BookingRecycle;
  let fixture: ComponentFixture<BookingRecycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRecycle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRecycle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
