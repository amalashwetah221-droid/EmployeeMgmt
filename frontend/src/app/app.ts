import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DecimalPipe, DatePipe, CommonModule } from '@angular/common';

import { Header } from './components/header/header';
import { Sidenav } from './components/sidenav/sidenav';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    Header,
    Sidenav
  ],
  providers: [
    DecimalPipe,
    DatePipe
  ],
  template: `
    <app-header></app-header>
    <div style="display:flex;min-height:calc(100vh - 64px)">
      <app-sidenav class="sidenav"></app-sidenav>
      <main style="flex:1;padding:20px">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  private auth = inject(AuthService);
}
