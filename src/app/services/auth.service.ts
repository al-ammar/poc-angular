import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {mergeMap, retryWhen, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable, range, timer, zip } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private canAccess = new BehaviorSubject<boolean>(false);
  public canAccess$ = this.canAccess.asObservable();

  constructor(private http:HttpClient) { 
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
    return (src: Observable<any>) => src.pipe(retryWhen(attempt => zip(range(1, maxentries), attempt).pipe(mergeMap(([i])=> timer(i * ms)))
    ));
  }
}

export class SessionUser extends User{
  authenticated : boolean = false;
}
