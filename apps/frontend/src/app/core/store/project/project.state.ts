import { Injectable } from '@angular/core';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { ProjectApiService } from '@frontend/shared/services/api/project-api.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of, switchMap } from 'rxjs';
import {
  CreateProject,
  FetchProjectList,
  UpdateProjectName,
} from './project.actions';

export interface ProjectStateModel {
  projects: Array<Project>;
}

@State<ProjectStateModel>({
  name: 'project',
  defaults: {
    projects: [],
  },
})
@Injectable()
export class ProjectState {
  constructor(private api: ProjectApiService) {}

  @Selector()
  static list(state: ProjectStateModel): Array<Project> {
    return state?.projects || [];
  }

  @Action(CreateProject)
  createProject(ctx: StateContext<ProjectStateModel>, action: CreateProject) {
    return this.api.create(action.payload).pipe(
      switchMap(project => {
        const state = ctx.getState();
        ctx.setState({
          projects: [...state.projects, project],
        });
        return of(project);
      }),
    );
  }

  @Action(UpdateProjectName)
  updateProject(
    ctx: StateContext<ProjectStateModel>,
    action: UpdateProjectName,
  ) {
    return this.api.updateName(action.id, action.payload).pipe(
      switchMap(project => {
        const state = ctx.getState();
        const projects = state.projects.filter(p => p.id !== action.id);
        ctx.setState({
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

        ctx.setState({
          ...state,
          projects,
        });
        return of(projects);
      }),
    );
  }
}
