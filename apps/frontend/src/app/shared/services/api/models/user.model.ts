export interface User {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  lastActivity: string;
  activated: boolean;
  isAdmin: boolean;
  provider?: string | null;
  providerId?: string | null;
  permissions: string[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  permissions: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  permissions?: string[];
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  provider?: string | null;
}

export interface UserInvite {
  id: string;
  email: string;
  name: string;
  language: string;
  permissions: string[];
  createdAt: string;
  activated: boolean;
  inviteCode: string;
}

export interface CreateUserInvitePayload {
  email: string;
  name: string;
  language?: string;
  permissions?: string[];
}

export interface UpdateUserInvitePayload {
  email?: string;
  name?: string;
  language?: string;
  permissions?: string[];
}

export interface CreateUserFromInvitePayload {
  password: string;
}
