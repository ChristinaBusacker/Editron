import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '@frontend/core/services/request/request.service';
import {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectStatistics,
} from './models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly baseUrl = '/api/projects';

  constructor(private request: RequestService) {}

  /**
   * Get a project
   * @param id Project ID
   */
  get(id: string): Observable<Project> {
    return this.request.get<Project>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get Statistics of a project
   * @param id Project ID
   */
  getStatistics(id: string): Observable<ProjectStatistics> {
    return this.request.get<ProjectStatistics>(
      `${this.baseUrl}/${id}/statistics`,
    );
  }

  /**
   * List all projects
   */
  list(): Observable<Array<Project>> {
    return this.request.get<Array<Project>>(this.baseUrl);
  }

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
   * @param payload project payload
   */
  update(id: string, payload: UpdateProjectPayload): Observable<Project> {
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
