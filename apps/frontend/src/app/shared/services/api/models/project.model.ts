import { UserListItem } from './user.model';

export interface Project {
  id: string;
  name: string;
  owner: UserListItem;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
}

export interface UpdateProjectNamePayload {
  name: string;
}
