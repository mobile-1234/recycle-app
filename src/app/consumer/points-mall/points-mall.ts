import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-points-mall',
  imports: [CommonModule, RouterModule],
  templateUrl: './points-mall.html',
  styleUrl: './points-mall.scss'
})
export class PointsMallComponent {
  constructor() {}
}
