import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ai-operations-assistant',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ai-operations-assistant.html',
  styleUrl: './ai-operations-assistant.scss'
})
export class AiOperationsAssistant {
  constructor() {}
}
