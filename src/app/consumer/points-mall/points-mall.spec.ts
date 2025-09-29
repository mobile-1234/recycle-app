import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsMall } from './points-mall';

describe('PointsMall', () => {
  let component: PointsMall;
  let fixture: ComponentFixture<PointsMall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsMall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsMall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
