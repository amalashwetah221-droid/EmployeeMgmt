import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
})
export class Sidenav {}
