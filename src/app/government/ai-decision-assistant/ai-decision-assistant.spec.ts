import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiDecisionAssistant } from './ai-decision-assistant';

describe('AiDecisionAssistant', () => {
  let component: AiDecisionAssistant;
  let fixture: ComponentFixture<AiDecisionAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiDecisionAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiDecisionAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
