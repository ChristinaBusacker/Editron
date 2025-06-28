import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './core/store/auth/auth.state';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { UserBadgeDirective } from './core/directives/user-badge.directive';
import { User } from './shared/services/api/models/user.model';
import { NavigationState } from './core/store/navigation/navigation.state';
import { Logout } from './core/store/auth/auth.actions';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminWrapperComponent } from './shared/components/admin-wrapper/admin-wrapper.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    UserBadgeDirective,
    AdminWrapperComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isAuthenticated: Observable<boolean> = inject(Store).select(
    AuthState.isAuthenticated,
  );

  currentUser: Observable<User> = inject(Store).select(AuthState.currentUser);

  isLoading: Observable<boolean> = inject(Store).select(
    NavigationState.isLoading,
  );

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/', 'login']);
  }

  ngOnInit() {
    document.body.classList.add('dark-theme');
  }
}
