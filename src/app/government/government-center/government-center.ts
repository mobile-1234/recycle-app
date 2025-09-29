import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-government-center',
  imports: [CommonModule, RouterModule],
  templateUrl: './government-center.html',
  styleUrl: './government-center.scss'
})
export class GovernmentCenterComponent {
  constructor() {}
}
