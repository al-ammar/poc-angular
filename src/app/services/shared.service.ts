import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private static restAPI = '/rest';
  public static refUser       = '/users';


  constructor(private http: HttpClient) {}

  public searchUsers(user : User) : Observable<User>{
    const url = location.protocol + '//'+location.hostname+':8086'+SharedService.restAPI + SharedService.refUser+'/search';
    const data = JSON.stringify(user);
    const httpHeaders = new HttpHeaders().set('Content-Type','application/json');
    const httpOptions = {headers : httpHeaders}; 
    return this.http.post(url, data, httpOptions);
  }

  public getUsers(pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null) : Observable<User>{
      let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('size', `${pageSize}`)
      const url = location.protocol + '//'+location.hostname+':8086'+SharedService.restAPI + SharedService.refUser;
    return this.http.get(url, {params});
  }

  public createUser(user: User): Observable<any> {
    const url = location.protocol + '//' + location.hostname+':8086'+SharedService.restAPI + SharedService.refUser;
    const data = JSON.stringify(user);
    const httpHeaders = new HttpHeaders().set('Content-Type','application/json');
    const httpOptions = {headers : httpHeaders}; 
    return this.http.post(url, data, httpOptions);
  }

  public updateUser(id: string, user: User): Observable<any>{
    const url = location.protocol + '//' + location.hostname +':8086'+SharedService.restAPI+SharedService.refUser+'/'+id;
    const data = JSON.stringify(user);
    const httpHeaders = new HttpHeaders().set('Content-Type','application/json');
    const httpOptions = {headers : httpHeaders};
    return this.http.put(url, data, httpOptions);
  }

  public deleteUser(id: string): Observable<any> {
    const url = location.protocol + '//' + location.hostname+ ':8086'+SharedService.restAPI + SharedService.refUser+'/'+id;
    return this.http.delete(url);
  }
}
