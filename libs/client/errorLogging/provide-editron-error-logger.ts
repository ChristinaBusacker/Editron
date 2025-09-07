import { ErrorHandler, Provider } from '@angular/core';
import { GlobalAppErrorHandler } from './global-error.handler';

export const provideEditronErrorLogger: () => Provider = () => {
  return {
    provide: ErrorHandler,
    useClass: GlobalAppErrorHandler,
  };
};
