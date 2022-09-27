import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthService, SessionUser } from './services/auth.service';
import { HostListener } from '@angular/core';

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

  constructor(private auth: AuthService, private router: Router){

  }
  ngOnDestroy(): void {
    console.info('destroy isAuth');
    // localStorage.removeItem('isAuth');
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    console.info('canUserAccess'+this.canUserAccess);
    console.info('showFrame'+this.showIFrame);

    if(this.canUserAccess){
      this.router.navigate(['./']).then();
      this.canUserAccess = true;
      this.showIFrame = false;
    }
    this.subs.add(this.offlineEvent.subscribe(e => {
      console.log('Offline...');
    }));
    this.subs.add(
      this.auth.canAccess$.subscribe({
        next: (res) => {
          console.log('canAccess$ subscribe...'+res);
          this.canUserAccess= res; 
          if(!res){

            this.showIFrame = true;
            console.log('showIFrame :' +this.showIFrame);

            // this.router.navigate(['./login']).then();
          } else{
            this.showIFrame = false;
            console.log('showIFrame :' +this.showIFrame);
            // this.router.navigate(['./accueil']).then();
        } 
        },
        error : (err)=> {
          console.error(err);
          localStorage.setItem('errorMessage', err);
          this.showIFrame = true;    
        } ,
        complete: ()=> {
          console.log('login competed');
          console.log(this.canUserAccess);
        }
      }
          ));
        if(localStorage.getItem('isAuth') === 'true'){
          this.canUserAccess = true;
          this.showIFrame = false;
        }
      }  

      @HostListener('window:unload')
      onUnload(): void {
       console.log('onUnload');
      //  localStorage.removeItem('isAuth');
      }


      logout(){
        localStorage.removeItem('isAuth');
        this.auth.canUserAccess(false);
        this.router.navigate(['./']).then();
      }

}


