import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserListItem } from './models/user.model';
import { RequestService } from '@frontend/core/services/request/request.service';

@Injectable({ providedIn: 'root' })
export class ProjectMemberApiService {
  constructor(private request: RequestService) {}

  /**
   * Adds a user to a project
   * @param projectId Project ID
   * @param userId User ID
   */
  addUserToProject(
    projectId: string,
    userId: string,
  ): Observable<UserListItem> {
    const url = `/api/projects/${projectId}/members/${userId}`;
    return this.request.post<UserListItem>(url, {});
  }

  /**
   * Removes a user from a project
   * @param projectId Project ID
   * @param userId User ID
   */
  removeUserFromProject(
    projectId: string,
    userId: string,
  ): Observable<{ success: boolean }> {
    const url = `/api/projects/${projectId}/members/${userId}`;
    return this.request.delete<{ success: boolean }>(url);
  }

  /**
   * Lists all users in a project
   * @param projectId Project ID
   */
  getUsersForProject(projectId: string): Observable<UserListItem[]> {
    const url = `/api/projects/${projectId}/members`;
    return this.request.get<UserListItem[]>(url);
  }
}
