import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export class AuthInterceptorService implements HttpInterceptor {
  constructor() {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'apikey': `${environment.apiKey}`,
        'Content-Type': `application/json`,
      },
      responseType: req.responseType
    });
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )
  }
}
