import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';
import { cmsModulesResolver } from './core/resolvers/cmsmodules.resolver';
import { projectListResolver } from './core/resolvers/project-list.resolver';
import { projectResolver } from './core/resolvers/projectresolver';
import { ProjectDetailsComponent } from './pages/project/children/project-details/project-details.component';
import { ProjectEntityComponent } from './pages/project/children/project-entity-component/project-entity.component';
import { ProjectComponent } from './pages/project/project.component';
import { moduleEntityResolver } from './core/resolvers/module-entity.resolver';
import { EntryEditorComponent } from './pages/project/children/entry-editor/entry-editor.component';
import { entryResolver } from './core/resolvers/entry.resolver';
import { ProjectSettingsComponent } from './pages/project/children/project-settings/project-settings.component';

import { UserManagementComponent } from './pages/user-management/user-management.component';
import { adminGuard } from './core/guards/admin.guard';
import { userManagementResolver } from './core/resolvers/usermanagement.resolver';
import { InvitationComponent } from './pages/invitation/invitation.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'invitation', component: InvitationComponent },
  {
    path: 'projects',
    component: ProjectOverviewComponent,
    canActivate: [authGuard],
    resolve: [projectListResolver, cmsModulesResolver],
  },
  {
    path: 'settings',
    component: UserSettingsComponent,
    canActivate: [authGuard],
    resolve: [projectListResolver],
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [authGuard, adminGuard],
    resolve: [projectListResolver, userManagementResolver],
  },
  {
    path: ':projectId',
    component: ProjectComponent,
    canActivate: [authGuard],
    resolve: { data: projectResolver, modules: cmsModulesResolver },
    children: [
      {
        path: 'details',
        component: ProjectDetailsComponent,
      },
      {
        path: 'settings',
        component: ProjectSettingsComponent,
      },
      {
        path: ':moduleSlug/entries',
        component: ProjectEntityComponent,
        resolve: { entries: moduleEntityResolver, modules: cmsModulesResolver },
      },
      {
        path: ':moduleSlug/create',
        component: EntryEditorComponent,
        resolve: {
          entries: moduleEntityResolver,
          modules: cmsModulesResolver,
        },
      },
      {
        path: ':moduleSlug/:entityId',
        component: EntryEditorComponent,
        resolve: {
          entries: moduleEntityResolver,
          modules: cmsModulesResolver,
          entry: entryResolver,
        },
      },
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
