import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '@frontend/core/services/request/request.service';
import {
  Project,
  CreateProjectPayload,
  UpdateProjectNamePayload,
} from './models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly baseUrl = '/api/projects';

  constructor(private request: RequestService) {}

  /**
   * Creates a new project
   * @param payload Project creation payload
   */
  create(payload: CreateProjectPayload): Observable<Project> {
    return this.request.post<Project>(this.baseUrl, payload);
  }

  /**
   * Updates the name of an existing project
   * @param id Project ID
   * @param payload New name payload
   */
  updateName(
    id: string,
    payload: UpdateProjectNamePayload,
  ): Observable<Project> {
    return this.request.patch<Project>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Deletes a project by ID
   * @param id Project ID
   */
  delete(id: string): Observable<{ success: boolean }> {
    return this.request.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }
}
