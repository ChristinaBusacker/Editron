import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { RequestService } from '@frontend/core/services/request/request.service';
import { LoginPayload, LoginResponse } from './models/auth.model';
import { CookieService } from '@frontend/core/services/cookie/cookie.service';
import { User } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(
    private request: RequestService,
    private cookie: CookieService,
  ) {}

  /**
   * Logs in a user with email and password
   * @param credentials Email and password
   */
  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.request
      .post<LoginResponse>('/api/auth/login', credentials)
      .pipe(
        map(response => {
          this.cookie.set('Session', response.sessionId, 30);
          return response;
        }),
      );
  }

  /**
   * Deletes Session
   */
  logout(): Observable<boolean> {
    return this.request.get<boolean>('/api/auth/logout').pipe(
      map(response => {
        if (response) {
          this.cookie.delete('Session');
        }
        return response;
      }),
    );
  }

  /**
   * Fetches current session owner
   */
  loadCurrentUser(): Observable<User> {
    return this.request.get<User>('/api/auth/user').pipe(
      map(response => {
        console.log(response);
        return response;
      }),
    );
  }

  /**
   * Returns the full redirect URL for a given SSO provider
   * @param provider OAuth provider key (google | github | microsoft)
   */
  getSSORedirectUrl(provider: 'google' | 'github' | 'microsoft'): string {
    return `/api/auth/${provider}`;
  }
}
