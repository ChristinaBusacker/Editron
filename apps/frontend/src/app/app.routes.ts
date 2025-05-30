import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';
import { projectsResolver } from './core/resolvers/projects.resolver';
import { cmsModulesResolver } from './core/resolvers/cmsmodules.resolver';
import { projectDetailResolver } from './core/resolvers/project-details.resolver';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectDetailsComponent } from './pages/project/children/project-details/project-details.component';

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
    path: ':projectId',
    component: ProjectComponent,
    canActivate: [authGuard],
    resolve: { data: projectDetailResolver },
    children: [
      {
        path: 'details',
        component: ProjectDetailsComponent,
      },
      {
        path: ':entitySlug',
        component: ProjectComponent,
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
