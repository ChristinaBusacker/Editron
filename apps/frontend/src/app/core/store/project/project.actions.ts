import { ApiTokenPayload } from '@frontend/shared/services/api/models/api-tokens.model';
import {
  CreateProjectPayload,
  UpdateProjectPayload,
} from '@frontend/shared/services/api/models/project.model';

export class CreateProject {
  static readonly type = '[Project] Create';
  constructor(public payload: CreateProjectPayload) {}
}

export class UpdateProject {
  static readonly type = '[Project] Update';
  constructor(
    public id: string,
    public payload: UpdateProjectPayload,
  ) {}
}

export class FetchProjectList {
  static readonly type = '[Project] Fetch list';
  constructor() {}
}

export class FetchBinEntries {
  static readonly type = '[Project] Fetch bin entries';
  constructor(public projectId: string) {}
}

export class FetchApiTokens {
  static readonly type = '[Project] Fetch Api tokens';
  constructor(public projectId: string) {}
}

export class CreateApiTokens {
  static readonly type = '[Project] Create Api tokens';
  constructor(public payload: ApiTokenPayload) {}
}

export class DeleteApiTokens {
  static readonly type = '[Project] Delete Api tokens';
  constructor(public payload: { tokenId: string; projectId: string }) {}
}
