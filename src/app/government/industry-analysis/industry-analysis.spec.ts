import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryAnalysis } from './industry-analysis';

describe('IndustryAnalysis', () => {
  let component: IndustryAnalysis;
  let fixture: ComponentFixture<IndustryAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustryAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustryAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
