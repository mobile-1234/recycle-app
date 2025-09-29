import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiOperationsAssistant } from './ai-operations-assistant';

describe('AiOperationsAssistant', () => {
  let component: AiOperationsAssistant;
  let fixture: ComponentFixture<AiOperationsAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiOperationsAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiOperationsAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
