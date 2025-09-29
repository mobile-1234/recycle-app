import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoKnowledge } from './eco-knowledge';

describe('EcoKnowledge', () => {
  let component: EcoKnowledge;
  let fixture: ComponentFixture<EcoKnowledge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoKnowledge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoKnowledge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
