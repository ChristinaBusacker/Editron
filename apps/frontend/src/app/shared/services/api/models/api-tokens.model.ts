import { ApiTokenSettings } from '@shared/declarations/interfaces/api-token/api-token.interface';

export interface ApiTokenPayload {
  project: string;
  hasManagementAccess: boolean;
  hasReadAccess: boolean;
  hasWriteAccess: boolean;
  settings: ApiTokenSettings;
}
