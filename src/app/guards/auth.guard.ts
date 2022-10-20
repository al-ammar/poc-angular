import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";
import { extend } from "lodash";

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard extends KeycloakAuthGuard {
    
    constructor(
        router: Router,
        protected readonly keycloak: KeycloakService
      ) {
        super(router, keycloak);
      }
    
    public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        console.log(window.location.origin + state.url);
        if(!this.authenticated){
            await this.keycloakAngular.login({                
                redirectUri: window.location.origin + state.url,
            });
        }
        
        const requiredRoles = route.data['roles'];

        if((requiredRoles instanceof Array) || ( requiredRoles.length === 0)){
            return true;
        }

        // return requiredRoles.every((role: string)=> this.roles.includes(role));
        return true;
    }
    
}