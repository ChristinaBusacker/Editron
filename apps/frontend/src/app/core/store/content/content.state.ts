import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map } from 'rxjs';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { CreateEntry, FetchModuleEntries } from './content.actions';

export interface ContentStateModel {
  entries: { [key: string]: Array<any> };
}

@State<ContentStateModel>({
  name: 'content',
  defaults: {
    entries: {},
  },
})
@Injectable()
export class ContentState {
  constructor(private api: ContentApiService) {}

  @Selector()
  static entries(state: ContentStateModel): { [key: string]: Array<any> } {
    return state?.entries || {};
  }

  @Action(FetchModuleEntries)
  fetchModuleEntries(
    ctx: StateContext<ContentStateModel>,
    action: FetchModuleEntries,
  ) {
    return this.api.getEntries(action.projectId, action.module).pipe(
      map(entryResponse => {
        const state = ctx.getState();
        const entries = {
          ...state.entries,
        };

        entries[action.module] = entryResponse;
        ctx.patchState({ entries });
      }),
    );
  }

  @Action(CreateEntry)
  createEntry(ctx: StateContext<ContentStateModel>, action: CreateEntry) {
    return this.api.getEntries(action.projectId, action.module).pipe(
      map(entryResponse => {
        const state = ctx.getState();
        const entries = {
          ...state.entries,
        };
        entries[action.module] = entryResponse;
        ctx.patchState({ entries });
      }),
    );
  }
}
