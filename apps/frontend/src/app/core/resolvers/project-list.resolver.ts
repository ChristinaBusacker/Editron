import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { switchMap, of } from 'rxjs';
import { FetchProjectList } from '../store/project/project.actions';

export const projectListResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(Store);
  return store.dispatch(new FetchProjectList()).pipe(switchMap(() => of(true)));
};
