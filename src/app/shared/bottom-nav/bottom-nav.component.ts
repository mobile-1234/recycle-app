import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  @Input() activeTab: 'home' | 'booking' | 'earnings' | 'mall' | 'profile' = 'home';

  constructor(private router: Router) {}

  navigate(tab: 'home' | 'booking' | 'earnings' | 'mall' | 'profile') {
    if (this.activeTab === tab) return;
    switch (tab) {
      case 'home':
        this.router.navigate(['/consumer/home']);
        break;
      case 'booking':
        this.router.navigate(['/consumer/booking-recycle']);
        break;
      case 'earnings':
        this.router.navigate(['/consumer/earnings']);
        break;
      case 'mall':
        this.router.navigate(['/consumer/points-mall']);
        break;
      case 'profile':
        this.router.navigate(['/consumer/profile']);
        break;
    }
  }
}