import { ProjectSettings } from '@shared/declarations/interfaces/project/project-settings';
import { UserListItem } from './user.model';

export interface Project {
  id: string;
  name: string;
  owner: UserListItem;
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
}

export interface CreateProjectPayload {
  name: string;
  settings: ProjectSettings;
}

export interface UpdateProjectPayload {
  name: string;
  settings: ProjectSettings;
}
