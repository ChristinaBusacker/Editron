import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '@frontend/core/services/request/request.service';
import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UserListItem,
} from './models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly baseUrl = '/api/users';

  constructor(private request: RequestService) {}

  /**
   * Creates a new user
   * @param payload User creation payload
   */
  create(payload: CreateUserPayload): Observable<User> {
    return this.request.post<User>(this.baseUrl, payload);
  }

  /**
   * Updates an existing user
   * @param id User ID
   * @param payload Partial update data
   */
  update(id: string, payload: UpdateUserPayload): Observable<User> {
    return this.request.patch<User>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * Deletes a user by ID
   * @param id User ID
   */
  delete(id: string): Observable<void> {
    return this.request.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Lists all users (limited fields)
   */
  list(): Observable<UserListItem[]> {
    return this.request.get<UserListItem[]>(this.baseUrl);
  }
}
