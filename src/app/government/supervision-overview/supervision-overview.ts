import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-supervision-overview',
  imports: [CommonModule, RouterModule],
  templateUrl: './supervision-overview.html',
  styleUrl: './supervision-overview.scss'
})
export class SupervisionOverviewComponent {
  constructor() {}
}
