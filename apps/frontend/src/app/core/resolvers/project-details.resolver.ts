import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { ProjectApiService } from '@frontend/shared/services/api/project-api.service';
import { Store } from '@ngxs/store';
import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { forkJoin, Observable } from 'rxjs';
import { FetchCMSModules } from '../store/cmsModules/project.actions';

export interface ProjectDetailResovlerResponse {
  project: Project;
}

export const projectDetailResolver: ResolveFn<ProjectDetailResovlerResponse> = (
  route,
  state,
) => {
  const projectApi = inject(ProjectApiService);
  const store = inject(Store);

  const projectId = route.paramMap.get('projectId');

  const project = projectApi.get(projectId);
  store.dispatch(new FetchCMSModules());

  return forkJoin({
    project,
  });
};
