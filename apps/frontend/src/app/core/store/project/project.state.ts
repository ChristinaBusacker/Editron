import { Injectable } from '@angular/core';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { ProjectApiService } from '@frontend/shared/services/api/project-api.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of, switchMap } from 'rxjs';
import {
  CreateProject,
  FetchBinEntries,
  FetchProjectList,
  UpdateProject,
} from './project.actions';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';

export interface ProjectStateModel {
  projects: Array<Project>;
  binEntries: { [key: string]: any[] };
}

@State<ProjectStateModel>({
  name: 'project',
  defaults: {
    projects: [],
    binEntries: {},
  },
})
@Injectable()
export class ProjectState {
  constructor(
    private api: ProjectApiService,
    private contentApi: ContentApiService,
  ) {}

  @Selector()
  static list(state: ProjectStateModel): Array<Project> {
    return state?.projects || [];
  }

  @Selector()
  static binEntries(state: ProjectStateModel): { [key: string]: any[] } {
    return state?.binEntries || {};
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
}
