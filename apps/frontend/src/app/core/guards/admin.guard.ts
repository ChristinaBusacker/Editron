import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';
import { CookieService } from '../services/cookie/cookie.service';
import { SetSession } from '../store/auth/auth.actions';
import { of, map, catchError, switchMap } from 'rxjs';
import { RequestService } from '../services/request/request.service';
import { UserApiService } from '@frontend/shared/services/api/user-api.service';
import { AuthApiService } from '@frontend/shared/services/api/auth-api.service';

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  const router = inject(Router);
  const request = inject(RequestService);
  const cookie = inject(CookieService);
  const api = inject(AuthApiService);

  return store.select(AuthState.currentUser).pipe(
    switchMap(user => {
      if (!user) {
        return api.loadCurrentUser();
      }
      return of(user);
    }),
    map(user => {
      return user.isAdmin;
    }),
  );
};
