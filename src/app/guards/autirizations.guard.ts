import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";
import { extend } from "lodash";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class AuthorizationsGuard  implements CanActivate{
    private roles : string[] = [];

    constructor(
        protected readonly router: Router,
        protected readonly keycloak: KeycloakService
      ) {
        this.roles = this.keycloak.getUserRoles();
      }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        const requiredRoles = route.data['roles'];
        console.log(requiredRoles);

        if(!(requiredRoles instanceof Array) || ( requiredRoles.length === 0)){
            return true;
        }

        return requiredRoles.every((role: string)=> this.roles.includes(role));
       }


    
}