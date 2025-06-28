import { Project } from '@frontend/shared/services/api/models/project.model';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';

export class SetCurrentProject {
  static readonly type = '[Navigation] Set Project';
  constructor(public payload: Project) {}
}

export class SetCmsModule {
  static readonly type = '[Navigation] Set Modules';
  constructor(public payload: CmsModule) {}
}

export class SetLoading {
  static readonly type = '[Navigation] Set Loading';
  constructor(public payload: boolean) {}
}
