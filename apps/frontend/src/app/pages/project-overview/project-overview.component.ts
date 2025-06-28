import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { DialogResponse } from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { FormatDateDirective } from '@frontend/core/directives/format-date.directive';
import { UserBadgeDirective } from '@frontend/core/directives/user-badge.directive';
import { Logout } from '@frontend/core/store/auth/auth.actions';
import { ProjectState } from '@frontend/core/store/project/project.state';
import { AdminWrapperComponent } from '@frontend/shared/components/admin-wrapper/admin-wrapper.component';
import { DialogService } from '@frontend/shared/dialogs/dialog.service';
import { AuthApiService } from '@frontend/shared/services/api/auth-api.service';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-overview',
  imports: [
    CommonModule,
    AdminWrapperComponent,
    RouterModule,
    MatButtonModule,
    UserBadgeDirective,
    FormatDateDirective,
  ],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
})
export class ProjectOverviewComponent {
  projects: Observable<Project[]> = this.store.select(ProjectState.list);

  constructor(
    private router: Router,
    private store: Store,
    private dialog: DialogService,
  ) {}

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['login']);
  }

  openCreateDialog() {
    this.dialog
      .openCreateProjectDialog()
      .afterClosed()
      .subscribe((response: DialogResponse<object>) => {
        if (response.action === 'confirm') {
          debugger;
        }
      });
  }
}
