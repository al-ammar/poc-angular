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
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private token : string ='';

  constructor(private keycloak : KeycloakService, private auth: AuthService, private route: Router) {
    keycloak.getToken().then(r => this.token = r);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if(!this.keycloak.isLoggedIn()){
      this.keycloak.login();
    }
    if(this.keycloak.isTokenExpired()){
      console.log('Token expire => refresh');
      this.keycloak.getToken().then(r => this.token = r);
    }
    request.clone({
      setHeaders : {
        'Authorization' : 'Bearer' + this.token
      }
    });

    if (request.url.includes('assets/speed/image.7z')) {
      return next.handle(request);
    }
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
