import {
  CreateUserInvitePayload,
  UpdateUserInvitePayload,
} from '@frontend/shared/services/api/models/user.model';

export class UpdateInvitation {
  static readonly type = '[UserManagement] Update Invitation ';
  constructor(
    public id: string,
    public payload: UpdateUserInvitePayload,
  ) {}
}
export class CreateInvitation {
  static readonly type = '[UserManagement] Create Invitation';
  constructor(public payload: CreateUserInvitePayload) {}
}

export class FetchUsers {
  static readonly type = '[UserManagement] Fetch User';
  constructor() {}
}

export class FetchInvitations {
  static readonly type = '[UserManagement] Fetch Invitations';
  constructor() {}
}
