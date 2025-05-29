import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';

import { CookieService } from '../services/cookie/cookie.service';
import { SetLanguage } from '../store/localization/localization.actions';

export const localizationResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);
  const cookieService = inject(CookieService);

  const lang = cookieService.get('language');
  console.log(lang);

  if (lang === 'de' || lang === 'en' || lang === 'fr') {
    store.dispatch(new SetLanguage(lang));
  } else {
    store.dispatch(new SetLanguage('en'));
    cookieService.set('language', 'en');
  }

  return true;
};
