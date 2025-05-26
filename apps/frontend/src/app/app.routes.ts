import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';

// app-routing.module.ts
export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', component: ProjectOverviewComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
