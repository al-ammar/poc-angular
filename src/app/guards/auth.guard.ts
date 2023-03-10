import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";
import { extend } from "lodash";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard extends KeycloakAuthGuard  implements CanActivate{
    
    constructor(
        protected override readonly router: Router,
        protected readonly keycloak: KeycloakService
      ) {
        super(router, keycloak);
    }

    public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        if(!this.authenticated){
            await this.keycloakAngular.login({                
                redirectUri: window.location.origin + state.url,
            });
        }
        
        const requiredRoles = route.data['roles'];

        if(!(requiredRoles instanceof Array) || ( requiredRoles.length === 0)){
            return true;
        }

        return requiredRoles.find((role: string)=> this.roles.includes(role)) != undefined;
    }
    
}