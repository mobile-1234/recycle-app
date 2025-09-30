import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subsidy-management',
  imports: [CommonModule, RouterModule],
  templateUrl: './subsidy-management.html',
  styleUrl: './subsidy-management.scss'
})
export class SubsidyManagement {
  constructor() {}
}
