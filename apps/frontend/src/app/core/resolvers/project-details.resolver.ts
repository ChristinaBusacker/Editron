import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { ProjectApiService } from '@frontend/shared/services/api/project-api.service';
import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { forkJoin, Observable } from 'rxjs';

export interface ProjectDetailResovlerResponse {
  project: Project;
  schemas: CmsModule[];
}

export const projectDetailResolver: ResolveFn<ProjectDetailResovlerResponse> = (
  route,
  state,
) => {
  const projectApi = inject(ProjectApiService);
  const contentApi = inject(ContentApiService);

  const projectId = route.paramMap.get('projectId');

  const project = projectApi.get(projectId);
  const schemas = contentApi.getAllSchemas();

  return forkJoin({
    project,
    schemas,
  });
};
