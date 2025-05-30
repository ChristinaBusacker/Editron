import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateEntry,
  UpdateEntry,
  ValidateEntry,
} from './models/content.model';
import { RequestService } from '@frontend/core/services/request/request.service';

@Injectable({ providedIn: 'root' })
export class ContentApiService {
  private readonly baseUrl = '/api/content';

  constructor(private request: RequestService) {}

  // -------------------------------
  // ContentSchemas
  // -------------------------------

  getAllSchemas(): Observable<any> {
    return this.request.get(`${this.baseUrl}/schemas`);
  }

  getSchemaBySlug(schemaSlug: string): Observable<any> {
    return this.request.get(`${this.baseUrl}/schemas/${schemaSlug}`);
  }

  // -------------------------------
  // ContentEntries
  // -------------------------------

  getEntries(projectId: string, schemaSlug: string): Observable<any[]> {
    return this.request.get<any[]>(
      `${this.baseUrl}/projects/${projectId}/schemas/${schemaSlug}/entries`,
    );
  }

  createEntry(
    projectId: string,
    schemaSlug: string,
    dto: CreateEntry,
  ): Observable<any> {
    return this.request.post(
      `${this.baseUrl}/projects/${projectId}/schemas/${schemaSlug}/entries`,
      dto,
    );
  }

  getEntryDetails(entryId: number): Observable<any> {
    return this.request.get(`${this.baseUrl}/entries/${entryId}`);
  }

  updateEntry(entryId: number, dto: UpdateEntry): Observable<any> {
    return this.request.put(`${this.baseUrl}/entries/${entryId}`, dto);
  }

  deleteEntry(entryId: number): Observable<any> {
    return this.request.delete(`${this.baseUrl}/entries/${entryId}`);
  }

  // -------------------------------
  // ContentVersions
  // -------------------------------

  getVersions(entryId: number): Observable<any[]> {
    return this.request.get<any[]>(
      `${this.baseUrl}/entries/${entryId}/versions`,
    );
  }

  publishVersion(versionId: number): Observable<any> {
    return this.request.post(
      `${this.baseUrl}/versions/${versionId}/publish`,
      {},
    );
  }

  restoreVersion(versionId: number): Observable<any> {
    return this.request.post(
      `${this.baseUrl}/versions/${versionId}/restore`,
      {},
    );
  }

  // -------------------------------
  // Validation
  // -------------------------------

  validateEntry(dto: ValidateEntry): Observable<any> {
    return this.request.post(`${this.baseUrl}/validate`, dto);
  }
}
