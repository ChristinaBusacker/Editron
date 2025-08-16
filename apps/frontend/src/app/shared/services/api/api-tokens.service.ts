import { Injectable } from '@angular/core';
import { RequestService } from '@frontend/core/services/request/request.service';
import { ApiToken } from '@shared/declarations/interfaces/api-token/api-token.interface';
import { Observable } from 'rxjs';
import { ApiTokenPayload } from './models/api-tokens.model';

@Injectable({
  providedIn: 'root',
})
export class ApiTokensService {
  private readonly baseUrl = '/api/api-token';

  constructor(private request: RequestService) {}

  /**
   * List all API tokens for a project
   * @param projectId Project ID
   */
  list(projectId: string): Observable<Array<ApiToken>> {
    return this.request.get<Array<ApiToken>>(
      `${this.baseUrl}/list/${projectId}`,
    );
  }

  /**
   * Get a single API token by ID
   * @param tokenId Token ID
   */
  get(tokenId: string): Observable<ApiToken> {
    return this.request.get<ApiToken>(`${this.baseUrl}/${tokenId}`);
  }

  /**
   * Create a new API token
   * @param payload DTO for creating API token
   */
  create(payload: ApiTokenPayload): Observable<ApiToken> {
    return this.request.post<ApiToken>(this.baseUrl, payload);
  }

  /**
   * Delete an API token by ID
   * @param tokenId Token ID
   */
  delete(tokenId: string): Observable<{ success: boolean }> {
    return this.request.delete<{ success: boolean }>(
      `${this.baseUrl}/${tokenId}`,
    );
  }
}
