import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';
import { Project } from '@frontend/shared/services/api/models/project.model';

@Component({
  selector: 'app-project',
  imports: [RouterModule, SidenavComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  project!: Project;
}
