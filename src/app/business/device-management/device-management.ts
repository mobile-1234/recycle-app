import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-device-management',
  imports: [CommonModule, RouterModule],
  templateUrl: './device-management.html',
  styleUrl: './device-management.scss'
})
export class DeviceManagementComponent {
  constructor() {}
}
