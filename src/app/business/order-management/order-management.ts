import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-management',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-management.html',
  styleUrl: './order-management.scss'
})
export class OrderManagement {
  constructor() {}
}
