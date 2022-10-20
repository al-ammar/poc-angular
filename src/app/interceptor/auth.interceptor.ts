import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private route: Router) {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // const token = this.auth.getToken() || '';
    // request.clone({
    //   setHeaders : {
    //     'Authorization' : 'Bearer' + token
    //   }
    // });

    if (request.url.includes('assets/speed/image.7z')) {
      return next.handle(request);
    }
    // this.auth.canAccess$.subscribe(res => {
    //   if(res === true){
    //     next.handle(request);
    //   }
    //   this.route.navigate(['./login']).then();
    //   return;
    // },
    // err => {
    //   console.log(err);
    //   localStorage.setItem('errorMessage', err);
    //   this.route.navigate(['./login']).then();
    // });
    return next.handle(request)
    .pipe(
      catchError((error : any) => {
       console.log(error);
       console.log(error.error)
       console.log(error.message) ;
       console.log(error.statusText) ;
       throw error.error;
      }));
  }
}
