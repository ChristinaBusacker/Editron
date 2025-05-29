import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Localizations } from '../../declarations/interfaces/localizations.interface';
import { CookieService } from '@frontend/core/services/cookie/cookie.service';
import { LocalizationService } from '@frontend/core/services/localization/localization.service';
import { SetLanguage } from './localization.actions';

// Actions

// State Model
export interface LocalizationStateModel {
  currentLanguage: 'de' | 'fr' | 'en';
  localizations: Localizations;
}

// Default state
const defaults: LocalizationStateModel = {
  currentLanguage: 'de',
  localizations: {},
};

@State<LocalizationStateModel>({
  name: 'localization',
  defaults,
})
@Injectable()
export class LocalizationState {
  constructor(
    private localizationService: LocalizationService,
    private cookieService: CookieService,
  ) {}

  @Selector()
  static currentLanguage(state: LocalizationStateModel): 'de' | 'fr' | 'en' {
    return state.currentLanguage;
  }

  @Selector()
  static getLocalizations(state: LocalizationStateModel): Localizations {
    return state.localizations;
  }

  @Action(SetLanguage)
  async setLanguage(
    ctx: StateContext<LocalizationStateModel>,
    action: SetLanguage,
  ) {
    const state = ctx.getState();
    if (
      action.language !== state.currentLanguage ||
      Object.keys(state.localizations).length < 1
    ) {
      this.cookieService.set('language', action.language);
      this.localizationService
        .getLocalizations(action.language)
        .subscribe(localizations => {
          if (!(localizations instanceof HttpErrorResponse)) {
            ctx.setState({
              currentLanguage: action.language,
              localizations: localizations,
            });
          }
        });
    }
  }
}
