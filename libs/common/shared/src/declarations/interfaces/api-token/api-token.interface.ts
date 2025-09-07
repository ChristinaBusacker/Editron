import { User } from '@frontend/shared/services/api/models/user.model';

export interface ApiTokenSettings {
  foo: string;
}

export interface ApiToken {
  id: string;
  token: string;
  hasManagementAccess: boolean;
  hasReadAccess: boolean;
  hasWriteAccess: boolean;
  updatedBy: User;
  createdBy: User;
  settings: ApiTokenSettings;
}
