import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
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

import { DialogService } from './shared/dialogs/dialog.service';
import { CmsModuleState } from './core/store/cmsModules/cmsModules.state';
import { NavigationState } from './core/store/navigation/navigation.state';
import { ContentState } from './core/store/content/content.state';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LanguageService } from './core/services/language/language.service';

registerLocaleData(localeDe);

const states = [
  AuthState,
  ProjectState,
  LocalizationState,
  CmsModuleState,
  NavigationState,
  ContentState,
];

const coreServices = [
  CookieService,
  RequestService,
  SnackbarService,
  DialogService,
  LanguageService,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    ...coreServices,
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_LOCALE,
      useValue: navigator.language || navigator.languages[0] || 'en-US',
    },
    { provide: LOCALE_ID, useValue: 'de' },
    provideStore([...states], withNgxsReduxDevtoolsPlugin()),
  ],
};
