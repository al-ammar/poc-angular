import { KeycloakOptions, KeycloakService } from "keycloak-angular";
import { environment } from "src/environments/environment";

export function initalizer( keycloack: KeycloakService): () => Promise<boolean> {

    const options: KeycloakOptions = {
        config: {
            url:'http://localhost:8080/',
            realm: 'frontend',
            clientId: 'front',  
              
        },
        // loadUserProfileAtStartUp: false,
        initOptions : {
            onLoad:'login-required',
            checkLoginIframe: false,
        },
        bearerExcludedUrls: []
    };
    return (): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
          try {
            await keycloack.init( options);
            resolve(true);
            localStorage.setItem('isAuth', 'true');
        } catch (error) {
            console.log(error);
            reject(error);
          }
        });
      };
}