import { Injectable } from '@angular/core';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import {
  SetCmsModule,
  SetCurrentProject,
  SetLoading,
} from './navigation.actions';

export interface NavigationStateModel {
  project: Project | null;
  module: CmsModule;
  isLoading: boolean;
}

@State<NavigationStateModel>({
  name: 'navigation',
  defaults: {
    project: null,
    module: null,
    isLoading: false,
  },
})
@Injectable()
export class NavigationState {
  constructor() {}

  @Selector()
  static currentProject(state: NavigationStateModel): Project | null {
    return state?.project || null;
  }

  @Selector()
  static cmsModule(state: NavigationStateModel): CmsModule | null {
    return state?.module || null;
  }

  @Selector()
  static isLoading(state: NavigationStateModel): boolean {
    return state?.isLoading;
  }

  @Action(SetCurrentProject)
  setCurrentProject(
    ctx: StateContext<NavigationStateModel>,
    action: SetCurrentProject,
  ) {
    ctx.patchState({
      project: action.payload,
    });
  }

  @Action(SetCmsModule)
  setCmsModules(ctx: StateContext<NavigationStateModel>, action: SetCmsModule) {
    ctx.patchState({
      module: action.payload,
    });
  }

  @Action(SetLoading)
  setLoading(ctx: StateContext<NavigationStateModel>, action: SetLoading) {
    ctx.patchState({
      isLoading: action.payload,
    });
  }
}
