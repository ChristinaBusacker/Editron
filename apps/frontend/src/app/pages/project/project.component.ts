import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-project',
  imports: [RouterModule, SidenavComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {}
