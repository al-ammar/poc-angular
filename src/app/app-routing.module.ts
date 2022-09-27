import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ForbidenComponent } from './modules/forbiden/forbiden.component';
import { LoginComponent } from './modules/login/login.component';
import { UsersComponent } from './modules/user/users/users.component';

const routes: Routes = [
  // {path:'', redirectTo:'home', pathMatch:'full'},
  // {path:'login', component:LoginComponent},
  {path: 'home', component:AppComponent },
  {path: 'forbiden', component:ForbidenComponent},
  // {path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) }
  {path: 'users', component:UsersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
