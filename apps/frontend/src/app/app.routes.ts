import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';
import { projectsResolver } from './core/resolvers/projects.resolver';

// app-routing.module.ts
export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  {
    path: 'projects',
    component: ProjectOverviewComponent,
    canActivate: [authGuard],
    resolve: [projectsResolver],
  },
  { path: '**', redirectTo: '' },
];
