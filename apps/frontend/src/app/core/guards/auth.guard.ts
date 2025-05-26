import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from '../services/cookie/cookie.service';
import { RequestService } from '../services/request/request.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private request: RequestService,
    private router: Router,
  ) {}

  /**
   * Checks whether a session is valid by verifying it with the backend.
   * If invalid, removes the session cookie and redirects to /login.
   */
  canActivate(): Observable<boolean | UrlTree> {
    const sessionId = this.cookieService.get('Session');

    if (!sessionId) {
      return of(this.router.createUrlTree(['/login']));
    }

    return this.request.get<void>(`/api/auth/validate/${sessionId}`).pipe(
      map(() => true),
      catchError(() => {
        this.cookieService.delete('Session'); // Remove invalid session
        return of(this.router.createUrlTree(['/login']));
      }),
    );
  }
}
