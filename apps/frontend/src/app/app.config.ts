import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import { AuthGuard } from './core/guards/auth.guard';
import { CookieService } from './core/services/cookie/cookie.service';
import { RequestService } from './core/services/request/request.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    CookieService,
    RequestService,
    AuthGuard,
  ],
};
