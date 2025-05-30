import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';
import { projectsResolver } from './core/resolvers/projects.resolver';
import { cmsModulesResolver } from './core/resolvers/cmsmodules.resolver';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { projectDetailResolver } from './core/resolvers/project-details.resolver';

// app-routing.module.ts
export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'projects',
    component: ProjectOverviewComponent,
    canActivate: [authGuard],
    resolve: [projectsResolver, cmsModulesResolver],
  },
  {
    path: ':projectId/details',
    component: ProjectDetailsComponent,
    canActivate: [authGuard],
    resolve: { data: projectDetailResolver },
  },
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
