import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Logout } from '@frontend/core/store/auth/auth.actions';
import { AuthApiService } from '@frontend/shared/services/api/auth-api.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-project-overview',
  imports: [],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
})
export class ProjectOverviewComponent {
  constructor(
    private authService: AuthApiService,
    private router: Router,
    private store: Store,
  ) {}

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['login']);
  }
}
