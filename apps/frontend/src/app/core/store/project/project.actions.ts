import {
  CreateProjectPayload,
  UpdateProjectNamePayload,
} from '@frontend/shared/services/api/models/project.model';

export class CreateProject {
  static readonly type = '[Project] Create';
  constructor(public payload: CreateProjectPayload) {}
}

export class UpdateProjectName {
  static readonly type = '[Project] Update Name';
  constructor(
    public id: string,
    public payload: UpdateProjectNamePayload,
  ) {}
}

export class FetchProjectList {
  static readonly type = '[Project] Fetch list';
  constructor() {}
}
