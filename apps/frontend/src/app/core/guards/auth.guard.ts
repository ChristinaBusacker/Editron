import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';
import { CookieService } from '../services/cookie/cookie.service';
import { SetSession } from '../store/auth/auth.actions';
import { of, map, catchError } from 'rxjs';
import { RequestService } from '../services/request/request.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const router = inject(Router);
  const request = inject(RequestService);
  const cookie = inject(CookieService);

  // Access the query params using the ActivatedRouteSnapshot provided by the router state
  let sessionId = route.queryParamMap.get('sessionId');

  if (sessionId) {
    store.dispatch(new SetSession(sessionId));
    cookie.set('Session', sessionId);
  } else {
    sessionId = cookie.get('Session');
  }

  if (!sessionId) {
    return of(router.createUrlTree(['/login']));
  }

  return request.get<void>(`/api/auth/validate/${sessionId}`).pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
