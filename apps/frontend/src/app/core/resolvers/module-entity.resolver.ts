import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Store } from '@ngxs/store';
import { of, switchMap, map } from 'rxjs';
import { FetchModuleSchema } from '../store/cmsModules/cmsModules.actions';
import { CmsModuleState } from '../store/cmsModules/cmsModules.state';
import { FetchModuleEntries } from '../store/content/content.actions';
import { SetCmsModule } from '../store/navigation/navigation.actions';
import { NavigationState } from '../store/navigation/navigation.state';

export const moduleEntityResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(Store);
  const contentApi = inject(ContentApiService);

  const moduleSlug = route.paramMap.get('moduleSlug');
  if (!moduleSlug) return of(false);

  const storedModules = store.selectSnapshot(CmsModuleState.cmsModules);
  const project = store.selectSnapshot(NavigationState.currentProject);
  const existingModule = storedModules.find(m => m.slug === moduleSlug);

  store.dispatch(new FetchModuleSchema(moduleSlug));

  if (existingModule) {
    store.dispatch(new SetCmsModule(existingModule));
    store.dispatch(new FetchModuleEntries(project.id, moduleSlug));
    return of(true);
  }

  return contentApi.getAllSchemas().pipe(
    map(schemas => {
      const resolvedModule = schemas.find(m => m.slug === moduleSlug);
      if (!resolvedModule) {
        console.warn('Module not found in schemas');
        return false;
      }

      store.dispatch(new SetCmsModule(resolvedModule));
      store.dispatch(new FetchModuleEntries(project.id, moduleSlug));
      return true;
    }),
  );
};
