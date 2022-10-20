import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {mergeMap, retryWhen, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable, range, timer, zip } from 'rxjs';
import { User } from '../models/user';
import { KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private canAccess = new BehaviorSubject<boolean>(false);
  public canAccess$ = this.canAccess.asObservable();

  constructor(private http:HttpClient, 
    private keycloak : KeycloakService) { 
  }

  getLogin(email: string, password: string): Observable<SessionUser>{
    const httpHeader = new HttpHeaders().set('Content-Type', 'application/json');
    const httpOptions = {headers: httpHeader};
    const url = location.protocol + '//localhost:8086'+ '/rest/login';
    return this.http.get<SessionUser>(url)
    .pipe(this.backoff());
  }

  login(email: string, password: string): Observable<SessionUser>{
    const httpHeader = new HttpHeaders().set('Content-Type', 'application/json');
    const httpOptions = {headers: httpHeader};
    const url = location.protocol + '//localhost:8086'+ '/rest/login';
    return this.http.post<SessionUser>(url, {userName: email, password: password}, httpOptions)
    .pipe(this.backoff());
  }

  public canUserAccess(f: boolean){
    this.canAccess.next(f);
  }

  private backoff(maxentries = 2, ms =150) {
    return (src: Observable<any>) => src.pipe(retryWhen((attempt : any)=> zip(range(1, maxentries), attempt).pipe(mergeMap(([i])=> timer(i * ms)))
    ));
  }

  public getLoggedUser() : KeycloakTokenParsed | undefined{
    try{
      const userDetails: KeycloakTokenParsed | undefined = this.keycloak.getKeycloakInstance().idTokenParsed;
      return userDetails;
    }
    catch(e){
      console.error("Exception", e);
      return undefined;
    }
    return undefined;
  }

  public getToken(): string{
    return this.keycloak.getKeycloakInstance().token!;
  }



  public async isLoggedIn(): Promise<boolean> {
      return this.keycloak.isLoggedIn()
        .then((result: any) => {
          console.log(result);
          return result;
        })
        .catch((err: Error) => {
          console.log(err);
          return false;
      });
      
}

  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloak.loadUserProfile();
  }

  public loginKeycloak(): void {
    this.keycloak.login();
  }

  public logout(): void {    
    this.keycloak.logout();
  }

  public redirectToProfile(): void {
    this.keycloak.getKeycloakInstance().accountManagement();
  }

  public getRoles(): string[] {
    return this.keycloak.getUserRoles();
  }
}

export class SessionUser extends User{
  authenticated : boolean = false;
}
