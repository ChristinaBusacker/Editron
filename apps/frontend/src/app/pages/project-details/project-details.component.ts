import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterModule,
} from '@angular/router';
import { ProjectDetailResovlerResponse } from '@frontend/core/resolvers/project-details.resolver';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';

@Component({
  selector: 'app-project-details',
  imports: [RouterModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnInit {
  schemas: CmsModule[] = [];
  project!: Project;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const resolved = data['data'] as ProjectDetailResovlerResponse;
      this.project = resolved.project;
      this.schemas = resolved.schemas;
    });
  }
}
