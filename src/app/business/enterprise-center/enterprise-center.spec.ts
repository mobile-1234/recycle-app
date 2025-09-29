import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseCenter } from './enterprise-center';

describe('EnterpriseCenter', () => {
  let component: EnterpriseCenter;
  let fixture: ComponentFixture<EnterpriseCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterpriseCenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterpriseCenter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
