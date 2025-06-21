import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
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
  private readonly baseUrl = '/api/assets';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  /**
   * Builds the default headers including the x-auth header if the Session cookie is set
   */
  private buildHeaders(): HttpHeaders {
    return buildAuthHeaders(this.cookieService);
  }

  uploadAsset(file: File): Observable<UploadAssetResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadAssetResponse>(this.baseUrl, formData, {
      headers: this.buildHeaders(),
    });
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
