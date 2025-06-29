import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from '@frontend/core/services/request/request.service';
import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UserListItem,
  UserInvite,
  CreateUserInvitePayload,
  UpdateUserInvitePayload,
  CreateUserFromInvitePayload,
} from './models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly baseUrl = '/api/users';

  constructor(private request: RequestService) {}

  create(payload: CreateUserPayload): Observable<User> {
    return this.request.post<User>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdateUserPayload): Observable<User> {
    return this.request.patch<User>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.request.delete<void>(`${this.baseUrl}/${id}`);
  }

  list(): Observable<UserListItem[]> {
    return this.request.get<UserListItem[]>(this.baseUrl);
  }

  getInvite(inviteCode: string): Observable<UserInvite> {
    return this.request.get<UserInvite>(`${this.baseUrl}/invite/${inviteCode}`);
  }

  listInvites(): Observable<UserInvite[]> {
    return this.request.get<UserInvite[]>(`${this.baseUrl}/invite`);
  }

  createInvite(payload: CreateUserInvitePayload): Observable<UserInvite> {
    return this.request.post<UserInvite>(`${this.baseUrl}/invite`, payload);
  }

  updateInvite(
    id: string,
    payload: UpdateUserInvitePayload,
  ): Observable<UserInvite> {
    return this.request.patch<UserInvite>(
      `${this.baseUrl}/invite/${id}`,
      payload,
    );
  }

  renewInvite(id: string): Observable<UserInvite> {
    return this.request.patch<UserInvite>(
      `${this.baseUrl}/invite/${id}/renew`,
      {},
    );
  }

  createUserFromInvite(
    inviteCode: string,
    payload: CreateUserFromInvitePayload,
  ): Observable<string> {
    return this.request.post<string>(
      `${this.baseUrl}/invite/${inviteCode}`,
      payload,
    );
  }
}
