import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Localizations } from '@frontend/core/declarations/interfaces/localizations.interface';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  constructor(private requestService: RequestService) {}

  getLocalizations(
    language: 'de' | 'fr' | 'en',
  ): Observable<Localizations | HttpErrorResponse> {
    return this.requestService.get<Localizations>('localization', {
      language,
    });
  }
}
