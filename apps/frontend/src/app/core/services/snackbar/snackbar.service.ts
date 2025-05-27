import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(
    message: string,
    action: string = 'OK',
    config: Partial<MatSnackBarConfig> = {},
  ) {
    const defaultConfig: MatSnackBarConfig = {
      duration: 13000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-default'],
      ...config,
    };

    this.snackBar.open(message, action, defaultConfig);
  }

  success(message: string, action: string = '', duration = 3000) {
    this.show(message, action, {
      duration,
      panelClass: ['snackbar-success'],
    });
  }

  error(message: string, action: string = '', duration = 5000) {
    this.show(message, action, {
      duration,
      panelClass: ['snackbar-error'],
    });
  }

  info(message: string, action: string = '', duration = 3000) {
    this.show(message, action, {
      duration,
      panelClass: ['snackbar-info'],
    });
  }

  warning(message: string, action: string = '', duration = 4000) {
    this.show(message, action, {
      duration,
      panelClass: ['snackbar-warning'],
    });
  }
}
