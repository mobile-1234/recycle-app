import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-industry-analysis',
  imports: [CommonModule, RouterModule],
  templateUrl: './industry-analysis.html',
  styleUrl: './industry-analysis.scss'
})
export class IndustryAnalysis {
  constructor() {}
}
