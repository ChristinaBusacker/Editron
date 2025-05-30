import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { ProjectApiService } from '@frontend/shared/services/api/project-api.service';
import { Store } from '@ngxs/store';
import { map } from 'rxjs';
import { SetCurrentProject } from '../store/navigation/navigation.actions';
import { ProjectState } from '../store/project/project.state';
import { NavigationState } from '../store/navigation/navigation.state';

export const projectResolver: ResolveFn<Project> = (route, state) => {
  const projectApi = inject(ProjectApiService);
  const store = inject(Store);

  let projectId = route.paramMap.get('projectId');

  if (!projectId) {
    const project = store.selectSnapshot(NavigationState.currentProject);
    projectId = project.id;
  }

  const project = projectApi.get(projectId);

  return project.pipe(
    map(project => {
      store.dispatch(new SetCurrentProject(project));
      return project;
    }),
  );
};
