import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';
import { CookieService } from '../services/cookie/cookie.service';
import { SetSession } from '../store/auth/auth.actions';
import { of, map, catchError } from 'rxjs';
import { RequestService } from '../services/request/request.service';

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const router = inject(Router);
  const request = inject(RequestService);
  const cookie = inject(CookieService);

  return store.select(AuthState.isAdmin);
};
