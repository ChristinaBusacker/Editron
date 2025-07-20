import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

export interface CanComponentDeactivate {
  hasUnsavedChanges: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState,
): Observable<boolean> | boolean => {
  if (!component.hasUnsavedChanges()) return true;

  return window.confirm(
    'Du hast ungespeicherte Änderungen. Seite wirklich verlassen?',
  );
};
