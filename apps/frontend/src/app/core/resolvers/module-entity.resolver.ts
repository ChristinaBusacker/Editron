import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { CmsModuleState } from '../store/cmsModules/cmsModules.state';
import { SetCmsModule } from '../store/navigation/navigation.actions';
import { NavigationState } from '../store/navigation/navigation.state';
import { FetchModuleEntries } from '../store/content/content.actions';

export const moduleEntityResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(Store);

  const storedModules = store.selectSnapshot(CmsModuleState.cmsModules);
  const project = store.selectSnapshot(NavigationState.currentProject);

  let moduleSlug = route.paramMap.get('moduleSlug');
  const module = storedModules.find(m => m.slug === moduleSlug);

  if (!module) {
    return false;
  }

  store.dispatch(new SetCmsModule(module));
  store.dispatch(new FetchModuleEntries(project.id, moduleSlug));

  return true;
};
