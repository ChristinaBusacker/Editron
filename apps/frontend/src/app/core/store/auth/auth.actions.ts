export class Login {
  static readonly type = '[Auth] Login';
  constructor(
    public email: string,
    public password: string,
  ) {}
}

export class LoadCurrentUser {
  static readonly type = '[Auth] Current User';
  constructor() {}
}

export class SetSession {
  static readonly type = '[Auth] Set Session';
  constructor(public sessionId: string) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
