import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-data-reports',
  imports: [CommonModule, RouterModule],
  templateUrl: './data-reports.html',
  styleUrl: './data-reports.scss'
})
export class DataReportsComponent {
  constructor() {}
}
