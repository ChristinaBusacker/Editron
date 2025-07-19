import { ProjectSettings } from '@shared/declarations/interfaces/project/project-settings';
import { User, UserListItem } from './user.model';

export interface Project {
  id: string;
  name: string;
  owner: UserListItem;
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
}

export interface ProjectStatistics {
  changesByDate: Record<string, number>;
  entriesPerSchema: { schema: string; count: number }[];
  lastUpdatedAt: string;
  lastUpdatedBy: User;
  lastUpdatedEntryId: string;
  lastUpdatedModule: string;
  publishedVersions: number;
  totalEntries: number;
  unpublishedVersions: number;
}

export interface CreateProjectPayload {
  name: string;
  settings: ProjectSettings;
}

export interface UpdateProjectPayload {
  name?: string;
  settings: ProjectSettings;
}
