import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class GlobalAppErrorHandler implements ErrorHandler {
  private http = inject(HttpClient);

  handleError(error: any): void {
    const payload = {
      message: error?.message ?? String(error),
      stack: error?.stack ?? null,
      context: window?.location?.href ?? null,
      meta: { userAgent: navigator?.userAgent },
    };

    this.http
      .post(environment.apiUrl + '/api/error', payload)
      .subscribe({ error: () => {} });
    console.error('Global client error:', error);
  }
}
