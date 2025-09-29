import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentCenter } from './government-center';

describe('GovernmentCenter', () => {
  let component: GovernmentCenter;
  let fixture: ComponentFixture<GovernmentCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentCenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentCenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
