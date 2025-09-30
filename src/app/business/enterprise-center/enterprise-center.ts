import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-enterprise-center',
  imports: [CommonModule, RouterModule],
  templateUrl: './enterprise-center.html',
  styleUrl: './enterprise-center.scss'
})
export class EnterpriseCenter {
  constructor() {}
}
