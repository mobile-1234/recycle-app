import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ai-decision-assistant',
  imports: [CommonModule, RouterModule],
  templateUrl: './ai-decision-assistant.html',
  styleUrl: './ai-decision-assistant.scss'
})
export class AiDecisionAssistant {
  constructor() {}
}
