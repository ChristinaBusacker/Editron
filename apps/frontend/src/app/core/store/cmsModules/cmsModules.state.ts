import { Injectable } from '@angular/core';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { map } from 'rxjs';
import { FetchCMSModules } from './cmsModules.actions';

export interface CmsModuleStateModel {
  modules: Array<CmsModule>;
}

@State<CmsModuleStateModel>({
  name: 'cmsModules',
  defaults: {
    modules: [],
  },
})
@Injectable()
export class CmsModuleState {
  constructor(private api: ContentApiService) {}

  @Selector()
  static cmsModules(state: CmsModuleStateModel): Array<CmsModule> {
    return state?.modules || [];
  }

  @Action(FetchCMSModules)
  fetchModules(ctx: StateContext<CmsModuleStateModel>) {
    return this.api.getAllSchemas().pipe(
      map(modules => {
        ctx.patchState({
          modules,
        });

        return modules;
      }),
    );
  }
}
