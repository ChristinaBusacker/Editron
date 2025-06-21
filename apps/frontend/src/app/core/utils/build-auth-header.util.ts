import { HttpHeaders } from '@angular/common/http';
import { CookieService } from '../services/cookie/cookie.service';

/**
 * Builds the default headers including the x-auth header if the Session cookie is set
 */
export function buildAuthHeaders(cookieService: CookieService): HttpHeaders {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const session = cookieService.get('Session');
  if (session) {
    headers = headers.set('x-auth', session);
  }
  return headers;
}
