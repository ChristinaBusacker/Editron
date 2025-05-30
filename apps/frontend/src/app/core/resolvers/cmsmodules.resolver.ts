import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { FetchCMSModules } from '../store/cmsModules/cmsModules.actions';
import { CmsModuleState } from '../store/cmsModules/cmsModules.state';

export const cmsModulesResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(Store);

  const storedModules = store.selectSnapshot(CmsModuleState.cmsModules);

  if (storedModules.length < 1) {
    store.dispatch(new FetchCMSModules());
  }

  return true;
};
