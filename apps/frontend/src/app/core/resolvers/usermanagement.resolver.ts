import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { EntryDetails } from '@frontend/shared/services/api/models/content.model';
import { UserApiService } from '@frontend/shared/services/api/user-api.service';
import { Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import {
  FetchInvitations,
  FetchUsers,
} from '../store/user-management/user-management.actions';

export const userManagementResolver: ResolveFn<Observable<[void, void]>> = (
  route,
  state,
) => {
  const store = inject(Store);

  return combineLatest([
    store.dispatch(new FetchUsers()),
    store.dispatch(new FetchInvitations()),
  ]);
};
