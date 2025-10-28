import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Sidenav } from './components/sidenav/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidenav,
    RouterModule
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
export class AppComponent {}
