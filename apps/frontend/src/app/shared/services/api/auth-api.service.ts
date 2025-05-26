import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '@frontend/core/services/request/request.service';
import { LoginPayload, LoginResponse } from './models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private request: RequestService) {}

  /**
   * Logs in a user with email and password
   * @param credentials Email and password
   */
  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.request.post<LoginResponse>('/api/auth/login', credentials);
  }

  /**
   * Returns the full redirect URL for a given SSO provider
   * @param provider OAuth provider key (google | github | microsoft)
   */
  getSSORedirectUrl(provider: 'google' | 'github' | 'microsoft'): string {
    return `/api/auth/${provider}`;
  }
}
