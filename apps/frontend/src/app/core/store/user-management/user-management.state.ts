import {
  UserInvite,
  UserListItem,
} from '@frontend/shared/services/api/models/user.model';

import { Injectable } from '@angular/core';
import { UserApiService } from '@frontend/shared/services/api/user-api.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map } from 'rxjs';
import {
  CreateInvitation,
  FetchInvitations,
  FetchUsers,
  UpdateInvitation,
} from './user-management.actions';

export interface UserManagementStateModel {
  invitations: UserInvite[];
  users: UserListItem[];
}

@State<UserManagementStateModel>({
  name: 'userManagement',
  defaults: {
    invitations: [],
    users: [],
  },
})
@Injectable()
export class UserManagementState {
  constructor(private service: UserApiService) {}

  @Selector()
  static users(state: UserManagementStateModel): UserListItem[] {
    return state.users;
  }

  @Selector()
  static invitations(state: UserManagementStateModel): UserInvite[] {
    return state?.invitations;
  }

  @Action(FetchInvitations)
  fetchInvitations(ctx: StateContext<UserManagementStateModel>) {
    return this.service.listInvites().pipe(
      map(invitations => {
        ctx.patchState({
          invitations,
        });
      }),
    );
  }

  @Action(FetchUsers)
  fetchUsers(ctx: StateContext<UserManagementStateModel>) {
    return this.service.list().pipe(
      map(users => {
        ctx.patchState({
          users,
        });
      }),
    );
  }

  @Action(UpdateInvitation)
  updateInvitation(
    ctx: StateContext<UserManagementStateModel>,
    action: UpdateInvitation,
  ) {
    return this.service.updateInvite(action.id, action.payload).pipe(
      map(invitation => {
        ctx.dispatch(new FetchInvitations());
      }),
    );
  }

  @Action(CreateInvitation)
  createInvitation(
    ctx: StateContext<UserManagementStateModel>,
    action: CreateInvitation,
  ) {
    return this.service.createInvite(action.payload).pipe(
      map(invitation => {
        ctx.dispatch(new FetchInvitations());
      }),
    );
  }

  ngxsOnInit(ctx: StateContext<UserManagementStateModel>): void {}
}
