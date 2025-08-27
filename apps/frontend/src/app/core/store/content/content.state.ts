import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, switchMap } from 'rxjs';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import {
  CreateEntry,
  FetchModuleEntries,
  FetchEntryVersions,
  PublishVersion,
  RestoreVersion,
  FetchEntryDetails,
} from './content.actions';
import { EntryDetails } from '@frontend/shared/services/api/models/content.model';

export interface ContentStateModel {
  entries: { [moduleSlug: string]: Array<any> };
  versions: { [entryId: number]: Array<any> };
  details: { [entryId: number]: EntryDetails | undefined };
}

@State<ContentStateModel>({
  name: 'content',
  defaults: {
    entries: {},
    versions: {},
    details: {},
  },
})
@Injectable()
export class ContentState {
  constructor(private readonly api: ContentApiService) {}

  // -------------------------------
  // Selectors
  // -------------------------------

  @Selector()
  static entriesByModule(state: ContentStateModel) {
    return (moduleSlug: string) => state.entries[moduleSlug] ?? [];
  }

  @Selector()
  static versionsByEntry(state: ContentStateModel) {
    return (entryId: number) => state.versions[entryId] ?? [];
  }

  @Selector()
  static entries(state: ContentStateModel) {
    return state.entries;
  }

  // -------------------------------
  // Actions
  // -------------------------------

  @Action(FetchModuleEntries)
  fetchModuleEntries(
    ctx: StateContext<ContentStateModel>,
    action: FetchModuleEntries,
  ) {
    return this.api.getEntries(action.projectId, action.module).pipe(
      map(entryResponse => {
        const state = ctx.getState();
        ctx.patchState({
          entries: {
            ...state.entries,
            [action.module]: entryResponse,
          },
        });
      }),
    );
  }

  @Action(CreateEntry)
  createEntry(ctx: StateContext<ContentStateModel>, action: CreateEntry) {
    // NOTE: In der aktuellen Codebasis ruft CreateEntry direkt getEntries auf.
    // Falls du später wirklich "create" brauchst, hängst du hier api.createEntry(...) davor.
    return this.api.getEntries(action.projectId, action.module).pipe(
      map(entryResponse => {
        const state = ctx.getState();
        ctx.patchState({
          entries: {
            ...state.entries,
            [action.module]: entryResponse,
          },
        });
      }),
    );
  }

  @Action(FetchEntryVersions)
  fetchEntryVersions(
    ctx: StateContext<ContentStateModel>,
    { entryId }: FetchEntryVersions,
  ) {
    return this.api.getVersions(entryId).pipe(
      map(versions => {
        const state = ctx.getState();
        ctx.patchState({
          versions: {
            ...state.versions,
            [entryId]: versions,
          },
        });
      }),
    );
  }

  @Action(FetchEntryDetails)
  fetchEntryDetails(
    ctx: StateContext<ContentStateModel>,
    { entryId }: FetchEntryDetails,
  ) {
    return this.api.getEntryDetails(String(entryId)).pipe(
      map(details => {
        const state = ctx.getState();
        ctx.patchState({
          details: {
            ...state.details,
            [entryId]: details,
          },
        });
      }),
    );
  }

  @Action(PublishVersion)
  publishVersion(
    ctx: StateContext<ContentStateModel>,
    { versionId, entryId }: PublishVersion,
  ) {
    return this.api.publishVersion(versionId).pipe(
      switchMap(() => this.api.getEntryDetails(String(entryId))),
      switchMap(details => {
        const state = ctx.getState();
        ctx.patchState({
          details: {
            ...state.details,
            [entryId]: details,
          },
        });
        return this.api.getVersions(entryId);
      }),
      map(versions => {
        const state = ctx.getState();
        ctx.patchState({
          versions: {
            ...state.versions,
            [entryId]: versions,
          },
        });
      }),
    );
  }

  @Action(RestoreVersion)
  restoreVersion(
    ctx: StateContext<ContentStateModel>,
    { versionId, entryId }: RestoreVersion,
  ) {
    return this.api.restoreVersion(versionId).pipe(
      switchMap(() => this.api.getEntryDetails(String(entryId))),
      switchMap(details => {
        const state = ctx.getState();
        ctx.patchState({
          details: {
            ...state.details,
            [entryId]: details,
          },
        });
        return this.api.getVersions(entryId);
      }),
      map(versions => {
        const state = ctx.getState();
        ctx.patchState({
          versions: {
            ...state.versions,
            [entryId]: versions,
          },
        });
      }),
    );
  }
}
