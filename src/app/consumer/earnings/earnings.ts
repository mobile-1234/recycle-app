import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-earnings',
  imports: [CommonModule, RouterModule],
  templateUrl: './earnings.html',
  styleUrl: './earnings.scss'
})
export class EarningsComponent {
  constructor() {}
}
