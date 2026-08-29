import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError } from '../error-handling/app-error';

/** Normalizes every HttpErrorResponse into an AppError — the only error shape features see. */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message =
          typeof error.error?.message === 'string' ? error.error.message : error.message;
        return throwError(() => new AppError(message, error.status));
      }
      return throwError(() => error);
    }),
  );
