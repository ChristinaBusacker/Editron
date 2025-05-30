import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { FetchProjectList } from '../store/project/project.actions';
import { FetchCMSModules } from '../store/cmsModules/project.actions';

export const cmsModulesResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(Store);

  store.dispatch(new FetchCMSModules());

  return true;
};
