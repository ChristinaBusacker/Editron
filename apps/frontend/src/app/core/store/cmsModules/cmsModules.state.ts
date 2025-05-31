import { Injectable } from '@angular/core';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { map } from 'rxjs';
import { FetchCMSModules, FetchModuleSchema } from './cmsModules.actions';
import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export interface CmsModuleStateModel {
  modules: Array<CmsModule>;
  schemas: { [key: string]: ContentSchemaDefinition };
}

@State<CmsModuleStateModel>({
  name: 'cmsModules',
  defaults: {
    modules: [],
    schemas: {},
  },
})
@Injectable()
export class CmsModuleState {
  constructor(private api: ContentApiService) {}

  @Selector()
  static cmsModules(state: CmsModuleStateModel): Array<CmsModule> {
    return state?.modules || [];
  }

  @Selector()
  static schemas(state: CmsModuleStateModel): {
    [key: string]: ContentSchemaDefinition;
  } {
    return state?.schemas || {};
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

  @Action(FetchModuleSchema)
  fetchSchema(
    ctx: StateContext<CmsModuleStateModel>,
    action: FetchModuleSchema,
  ) {
    return this.api.getSchemaBySlug(action.module).pipe(
      map(schemaDefinition => {
        const state = ctx.getState();
        const schemas = { ...state.schemas };
        schemas[action.module] = schemaDefinition.definition;
        ctx.patchState({
          schemas,
        });
      }),
    );
  }
}
