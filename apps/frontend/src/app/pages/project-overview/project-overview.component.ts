import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Logout } from '@frontend/core/store/auth/auth.actions';
import { ProjectState } from '@frontend/core/store/project/project.state';
import { AdminWrapperComponent } from '@frontend/shared/components/admin-wrapper/admin-wrapper.component';
import { AuthApiService } from '@frontend/shared/services/api/auth-api.service';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-overview',
  imports: [CommonModule, AdminWrapperComponent],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
})
export class ProjectOverviewComponent {
  projects: Observable<Project[]> = this.store.select(ProjectState.list);

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
