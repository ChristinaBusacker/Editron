import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectDetailResovlerResponse } from '@frontend/core/resolvers/project-details.resolver';
import { SidenavComponent } from '@frontend/shared/components/sidenav/sidenav.component';
import { Project } from '@frontend/shared/services/api/models/project.model';

@Component({
  selector: 'app-project-details',
  imports: [RouterModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnInit {
  project!: Project;

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      const resolved = data['data'] as ProjectDetailResovlerResponse;
      this.project = resolved.project;
    });
  }
}
