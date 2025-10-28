import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, RouterLink, RouterLinkActive, MatIconModule, NgClass, NgIf],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
})
export class Sidenav implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private sub = new Subscription();
  isAdminUser: boolean = false;
  canViewEmployees: boolean = false;
  isAuthenticated: boolean = false;

  ngOnInit(): void {
    this.sub.add(this.auth.authState$.subscribe(auth => {
      this.isAuthenticated = auth;
    }));
    this.sub.add(this.auth.role$.subscribe(role => {
      this.isAdminUser = role === 'ROLE_ADMIN';
      this.canViewEmployees = this.auth.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN']);
    }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
