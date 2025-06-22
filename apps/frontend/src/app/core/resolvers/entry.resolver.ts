import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { EntryDetails } from '@frontend/shared/services/api/models/content.model';
import { Observable } from 'rxjs';

export const entryResolver: ResolveFn<EntryDetails> = (route, state) => {
  const contentApi = inject(ContentApiService);
  const entityId = route.paramMap.get('entityId');

  if (!entityId) {
    throw new Error('Missing route parameter "entityId"');
  }

  return contentApi.getEntryDetails(entityId);
};
