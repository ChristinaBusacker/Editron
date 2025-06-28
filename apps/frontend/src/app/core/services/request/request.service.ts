import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from '../cookie/cookie.service.js';
import { buildAuthHeaders } from '@frontend/core/utils/build-auth-header.util.js';
import { Store } from '@ngxs/store';
import { catchError, finalize, tap } from 'rxjs/operators';
import { SetLoading } from '@frontend/core/store/navigation/navigation.actions.js';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = 'https://localhost:3000';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private store: Store,
  ) {}

  /**
   * Builds the default headers including the x-auth header if the Session cookie is set
   */
  private buildHeaders(): HttpHeaders {
    return buildAuthHeaders(this.cookieService);
  }

  private trackLoading<T>(obs$: Observable<T>): Observable<T> {
    this.store.dispatch(new SetLoading(true));
    return obs$.pipe(
      finalize(() => this.store.dispatch(new SetLoading(false))),
    );
  }

  /**
   * Sends a GET request
   * @param url Endpoint URL
   */
  get<T>(url: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }

    const request = this.http.get<T>(this.baseUrl + url, {
      headers: this.buildHeaders(),
      params: httpParams,
    });

    return this.trackLoading(request);
  }

  /**
   * Sends a POST request
   * @param url Endpoint URL
   * @param body Payload
   */
  post<T>(url: string, body: any): Observable<T> {
    const request = this.http.post<T>(this.baseUrl + url, body, {
      headers: this.buildHeaders(),
    });

    return this.trackLoading(request);
  }

  /**
   * Sends a DELETE request
   * @param url Endpoint URL
   */
  delete<T>(url: string): Observable<T> {
    const request = this.http.delete<T>(this.baseUrl + url, {
      headers: this.buildHeaders(),
    });

    return this.trackLoading(request);
  }

  /**
   * Sends a PATCH request
   * @param url Endpoint URL
   * @param body Payload
   */
  patch<T>(url: string, body: any): Observable<T> {
    const request = this.http.patch<T>(this.baseUrl + url, body, {
      headers: this.buildHeaders(),
    });

    return this.trackLoading(request);
  }

  /**
   * Sends a PUT request
   * @param url Endpoint URL
   * @param body Payload
   */
  put<T>(url: string, body: any): Observable<T> {
    const request = this.http.put<T>(this.baseUrl + url, body, {
      headers: this.buildHeaders(),
    });

    return this.trackLoading(request);
  }
}
