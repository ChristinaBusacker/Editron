import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import { CookieService } from './core/services/cookie/cookie.service';
import { RequestService } from './core/services/request/request.service';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStates, provideStore } from '@ngxs/store';
import { AuthState } from './core/store/auth/auth.state';
import { SnackbarService } from './core/services/snackbar/snackbar.service';
import { ProjectState } from './core/store/project/project.state';
import { LocalizationState } from './core/store/localization/localization.state';
import { CmsModuleState } from './core/store/cmsModules/project.state';
import { DialogService } from './shared/dialogs/dialog.service';

const states = [AuthState, ProjectState, LocalizationState, CmsModuleState];

const coreServices = [
  CookieService,
  RequestService,
  SnackbarService,
  DialogService,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    ...coreServices,
    provideStore([...states], withNgxsReduxDevtoolsPlugin()),
  ],
};
