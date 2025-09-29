import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidyManagement } from './subsidy-management';

describe('SubsidyManagement', () => {
  let component: SubsidyManagement;
  let fixture: ComponentFixture<SubsidyManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsidyManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsidyManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
