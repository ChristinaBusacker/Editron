import {
  CreateProjectPayload,
  UpdateProjectPayload,
} from '@frontend/shared/services/api/models/project.model';

export class CreateProject {
  static readonly type = '[Project] Create';
  constructor(public payload: CreateProjectPayload) {}
}

export class UpdateProjectName {
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
