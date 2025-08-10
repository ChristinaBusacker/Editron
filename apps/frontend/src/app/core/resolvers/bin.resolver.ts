import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Store } from '@ngxs/store';
import { NavigationState } from '../store/navigation/navigation.state';
import { FetchBinEntries } from '../store/project/project.actions';

export const binResolver: ResolveFn<any> = (route, state) => {
  const contentApi = inject(ContentApiService);
  const store = inject(Store);

  let projectId = route.paramMap.get('projectId');

  if (!projectId) {
    const current = store.selectSnapshot(NavigationState.currentProject);
    projectId = current?.id;
  }

  return store.dispatch(new FetchBinEntries(projectId));
};
