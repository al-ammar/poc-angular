import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { combineLatest, fromEvent, map, Observable, startWith, Subscription } from 'rxjs';
import { AuthService, SessionUser } from './services/auth.service';
import { HostListener } from '@angular/core';
import { KeycloakEventType, KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'mynewpoc';
  public isSpinning = false;
  public canUserAccess = false;
  public showIFrame = true;
  isCollapse = false;
  offlineEvent = fromEvent(window, 'unload');
  private subs: Subscription = new Subscription();
  private queryParam$ : Observable<QueryInt> = new Observable<QueryInt>();
  private user: string = 'user';
  constructor(
    private activatedRouted: ActivatedRoute,
    private auth: AuthService, 
    private router: Router,
    private keycloak : KeycloakService
    ){}
  ngOnDestroy(): void {
    this.auth.logout();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(
      this.keycloak.keycloakEvents$.subscribe({
        next: (e) => {
          if (e.type === KeycloakEventType.OnTokenExpired) {
            console.log('Refresh token');
            this.keycloak.updateToken(20);
          }  
          else if (e.type === KeycloakEventType.OnAuthLogout) {
            console.log('Deconnexion');
            this.router.navigate(['./forbiden']).then();
          }
          else if (e.type === KeycloakEventType.OnAuthRefreshSuccess) {
            console.log('Authentification succes');            
          }
        }
      }
    )
  );
  }
  // this.queryParam$ = this.activatedRouted.queryParamMap.pipe(
  //   startWith(convertToParamMap([])),
  //   map(q=>({has: (q.has(this.user)), user: (q.get(this.user)!)}))
  // );
  // this.auth.isLoggedIn().then(result => {
  //   console.log(result);
  //   this.canUserAccess = result;
  // });
    // try{
    // this.auth.init().then(
    //   r => {
    //     console.log(r);
    //     localStorage.setItem('init', ''+r);
    //     localStorage.setItem('isAuth', 'true');
    //     // this.auth.canUserAccess(true);
    //   }
    // );
    // }catch(error: any){
    //   console.log(error);
    // }
    
    // try{
    // this.auth.loginKeycloak();
    //    console.log('login');
    //     // localStorage.setItem('login', ''+result);
    //     // localStorage.setItem('isAuth', 'true');
    //    this.canUserAccess = true;
    // }catch(error: any){
    //   console.log(error);
    // }

      
      

    
    // this.subs.add(this.offlineEvent.subscribe(e => {
    //   console.log('Offline...');
    // }));
    // this.subs.add(
    //   this.auth.canAccess$.subscribe({
    //     next: (res) => {
    //       this.canUserAccess= res; 
    //       if(!res){
    //         this.showIFrame = true;
    //         // this.router.navigate(['./login']).then();
    //       } else{
    //         this.showIFrame = false;
    //         // this.router.navigate(['./accueil']).then();
    //     } 
    //     },
    //     error : (err)=> {
    //       console.error(err);
    //       localStorage.setItem('errorMessage', err);
    //       this.showIFrame = true;    
    //     } ,
    //     complete: ()=> {
    //       console.log('login competed');
    //       console.log(this.canUserAccess);
    //     }
      // }
      //     ));
    // this.subs.add(
    //   combineLatest([ this.queryParam$, this.auth.canAccess$]).subscribe(
    //     res=> {
    //       console.log('this.auth.canAccess$');
    //       console.log(res[0]);
    //       console.log('this.queryParam$');
    //       console.log(res[1]);
    //     }
    //   )
    // );
        // if(localStorage.getItem('isAuth') === 'true'){
        //   this.canUserAccess = true;
        //   this.showIFrame = false;
        // }
      
     

      // @HostListener('window:unload')
      // onUnload(): void {
      //  console.log('onUnload');
      // //  localStorage.removeItem('isAuth');
      // }


      logout(){
        this.auth.logout();
        localStorage.removeItem('isAuth');
        // this.auth.canUserAccess(false);
        // this.router.navigate(['./']).then();
      }

}

interface QueryInt {
  has: boolean;
  user: string;
}

