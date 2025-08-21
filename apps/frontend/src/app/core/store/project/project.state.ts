import { Injectable } from '@angular/core';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { ProjectApiService } from '@frontend/shared/services/api/project-api.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of, switchMap } from 'rxjs';
import {
  CreateApiTokens,
  CreateProject,
  DeleteApiTokens,
  FetchApiTokens,
  FetchBinEntries,
  FetchProjectList,
  UpdateProject,
} from './project.actions';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { ApiToken } from '@shared/declarations/interfaces/api-token/api-token.interface';
import { ApiTokensService } from '@frontend/shared/services/api/api-tokens.service';

export interface ProjectStateModel {
  projects: Array<Project>;
  binEntries: { [key: string]: any[] };
  apiTokens: ApiToken[];
}

@State<ProjectStateModel>({
  name: 'project',
  defaults: {
    projects: [],
    binEntries: {},
    apiTokens: [],
  },
})
@Injectable()
export class ProjectState {
  constructor(
    private api: ProjectApiService,
    private contentApi: ContentApiService,
    private apiTokenApi: ApiTokensService,
  ) {}

  @Selector()
  static list(state: ProjectStateModel): Array<Project> {
    return state?.projects || [];
  }

  @Selector()
  static binEntries(state: ProjectStateModel): { [key: string]: any[] } {
    return state?.binEntries || {};
  }

  @Selector()
  static apiTokens(state: ProjectStateModel): Array<ApiToken> {
    return state?.apiTokens || [];
  }

  @Action(CreateProject)
  createProject(ctx: StateContext<ProjectStateModel>, action: CreateProject) {
    return this.api.create(action.payload).pipe(
      switchMap(project => {
        const state = ctx.getState();
        ctx.patchState({
          projects: [...state.projects, project],
        });
        return of(project);
      }),
    );
  }

  @Action(UpdateProject)
  updateProject(ctx: StateContext<ProjectStateModel>, action: UpdateProject) {
    return this.api.update(action.id, action.payload).pipe(
      switchMap(project => {
        const state = ctx.getState();
        const projects = state.projects.filter(p => p.id !== action.id);
        ctx.patchState({
          projects: [...projects, project],
        });
        return of(project);
      }),
    );
  }

  @Action(FetchProjectList)
  fetchProjects(ctx: StateContext<ProjectStateModel>) {
    return this.api.list().pipe(
      switchMap(projects => {
        const state = ctx.getState();
        ctx.patchState({
          ...state,
          projects,
        });

        return of(projects);
      }),
    );
  }

  @Action(FetchBinEntries)
  fetchBinEntries(
    ctx: StateContext<ProjectStateModel>,
    action: FetchBinEntries,
  ) {
    return this.contentApi.getEntriesInBin(action.projectId).pipe(
      switchMap(entries => {
        const state = ctx.getState();

        const binEntries = state.binEntries;
        binEntries[action.projectId] = entries;

        ctx.patchState({
          ...state,
          binEntries,
        });

        return of(binEntries);
      }),
    );
  }

  @Action(FetchApiTokens)
  fetchApiTokens(ctx: StateContext<ProjectStateModel>, action: FetchApiTokens) {
    return this.apiTokenApi.list(action.projectId).pipe(
      switchMap(apiTokens => {
        ctx.patchState({ apiTokens });
        return of(apiTokens);
      }),
    );
  }

  @Action(CreateApiTokens)
  createApiTokens(
    ctx: StateContext<ProjectStateModel>,
    action: CreateApiTokens,
  ) {
    return this.apiTokenApi.create(action.payload).pipe(
      switchMap(token => {
        const state = ctx.getState();
        ctx.patchState({ apiTokens: [...state.apiTokens, token] });
        return of(token);
      }),
    );
  }

  @Action(DeleteApiTokens)
  deleteApiTokens(
    ctx: StateContext<ProjectStateModel>,
    action: DeleteApiTokens,
  ) {
    return this.apiTokenApi.delete(action.payload.tokenId).pipe(
      switchMap(() => {
        return ctx.dispatch(new FetchApiTokens(action.payload.projectId));
      }),
    );
  }
}
