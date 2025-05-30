import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { FetchProjectList } from '../store/project/project.actions';

export const projectListResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(Store);

  store.dispatch(new FetchProjectList());

  return true;
};
