import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from '../cookie/cookie.service.js';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = 'https://localhost:3000';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  /**
   * Builds the default headers including the x-auth header if the Session cookie is set
   */
  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const session = this.cookieService.get('Session');
    if (session) {
      headers = headers.set('x-auth', session);
    }
    return headers;
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

    return this.http.get<T>(this.baseUrl + url, {
      headers: this.buildHeaders(),
      params: httpParams,
    });
  }

  /**
   * Sends a POST request
   * @param url Endpoint URL
   * @param body Payload
   */
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, body, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Sends a DELETE request
   * @param url Endpoint URL
   */
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url, {
      headers: this.buildHeaders(),
    });
  }

  /**
   * Sends a PATCH request
   * @param url Endpoint URL
   * @param body Payload
   */
  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(this.baseUrl + url, body, {
      headers: this.buildHeaders(),
    });
  }
}
