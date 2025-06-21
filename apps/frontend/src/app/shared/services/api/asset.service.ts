import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import {
  UploadAssetResponse,
  UploadAssetFromDataPayload,
  Asset,
} from './models/asset.model';
import { CookieService } from '@frontend/core/services/cookie/cookie.service';
import { buildAuthHeaders } from '@frontend/core/utils/build-auth-header.util';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  public readonly baseUrl = 'https://localhost:3002/asset';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  /**
   * Builds the default headers including the x-auth header if the Session cookie is set
   */
  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const session = this.cookieService.get('Session');
    if (session) {
      headers = headers.set('x-auth', session);
    }
    return headers;
  }

  detectMimeTypeFromUrl(url: string): Observable<string> {
    return this.http
      .post<{
        mimeType: string;
        valid: boolean;
      }>(`${this.baseUrl}/validate-url`, { url }, { headers: this.buildHeaders() })
      .pipe(
        map(response => {
          if (!response.valid) {
            throw new Error(`Unsupported file type: ${response.mimeType}`);
          }
          return response.mimeType;
        }),
      );
  }

  uploadAsset(file: File): Observable<UploadAssetResponse | number> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<UploadAssetResponse>(this.baseUrl, formData, {
        headers: this.buildHeaders(),
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<UploadAssetResponse>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              // Fortschritt berechnen
              return Math.round((event.loaded / (event.total ?? 1)) * 100);

            case HttpEventType.Response:
              return event.body!;

            default:
              return 0;
          }
        }),
      );
  }

  uploadFromData(
    payload: UploadAssetFromDataPayload,
  ): Observable<UploadAssetResponse> {
    return this.http.post<UploadAssetResponse>(
      `${this.baseUrl}/from-data`,
      payload,
      {
        headers: this.buildHeaders(),
      },
    );
  }

  listAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.baseUrl, {
      headers: this.buildHeaders(),
    });
  }

  getAsset(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/${id}`);
  }

  downloadAsset(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
  }

  getVariant(id: string, variant: string, webp = false): Observable<Blob> {
    const params = new HttpParams().set('webp', webp.toString());
    return this.http.get(`${this.baseUrl}/${id}/${variant}`, {
      responseType: 'blob',
      params,
    });
  }
}
