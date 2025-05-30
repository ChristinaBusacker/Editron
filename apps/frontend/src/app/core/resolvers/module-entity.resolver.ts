import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { CmsModuleState } from '../store/cmsModules/cmsModules.state';
import { SetCmsModule } from '../store/navigation/navigation.actions';

export const moduleEntityResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(Store);

  const storedModules = store.selectSnapshot(CmsModuleState.cmsModules);

  let moduleSlug = route.paramMap.get('moduleSlug');
  const module = storedModules.find(m => m.slug === moduleSlug);

  if (!module) {
    return false;
  }

  store.dispatch(new SetCmsModule(module));

  return true;
};
