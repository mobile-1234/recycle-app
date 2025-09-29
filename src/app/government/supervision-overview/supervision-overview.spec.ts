import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionOverview } from './supervision-overview';

describe('SupervisionOverview', () => {
  let component: SupervisionOverview;
  let fixture: ComponentFixture<SupervisionOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisionOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisionOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
