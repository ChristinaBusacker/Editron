import { CookieService } from '@frontend/core/services/cookie/cookie.service';
import { AuthApiService } from '@frontend/shared/services/api/auth-api.service';
import { User } from '@frontend/shared/services/api/models/user.model';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, switchMap, tap } from 'rxjs';
import { LoadCurrentUser, Login, Logout, SetSession } from './auth.actions';
import { Injectable } from '@angular/core';

export interface AuthStateModel {
  user: User | null;
  sessionId: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    sessionId: null,
  },
})
@Injectable()
export class AuthState {
  constructor(
    private authApi: AuthApiService,
    private cookieService: CookieService,
  ) {}

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return Boolean(state.sessionId);
  }

  @Selector()
  static sessionId(state: AuthStateModel): string {
    return state.sessionId;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authApi
      .login({ email: action.email, password: action.password })
      .pipe(
        switchMap(response => {
          const sessionId = response.sessionId;
          ctx.patchState({
            sessionId,
          });
          return this.authApi.loadCurrentUser();
        }),
        map(user => {
          ctx.patchState({
            user,
          });
        }),
      );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    return this.authApi.logout().pipe(
      map(() => {
        ctx.setState({
          user: null,
          sessionId: null,
        });
      }),
    );
  }

  @Action(LoadCurrentUser)
  loadCurrentUser(ctx: StateContext<AuthStateModel>) {
    return this.authApi.loadCurrentUser().subscribe(user => {
      const state = ctx.getState();
      ctx.patchState({
        ...state,
        user,
      });
    });
  }

  @Action(SetSession)
  setSession(ctx: StateContext<AuthStateModel>, action: SetSession) {
    const state = ctx.getState();
    const { sessionId } = action;
    ctx.patchState({
      ...state,
      sessionId,
    });
    this.loadCurrentUser(ctx);
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>): void {
    const sessionId = this.cookieService.get('Session');
    if (sessionId) {
      this.authApi.loadCurrentUser().subscribe(user => {
        ctx.patchState({
          sessionId,
          user,
        });
      });
    }
  }
}
