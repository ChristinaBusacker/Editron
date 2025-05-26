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
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  provider?: string | null;
}
