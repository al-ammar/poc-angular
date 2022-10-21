import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthorizationsGuard } from './guards/autirizations.guard';
import { ForbidenComponent } from './modules/forbiden/forbiden.component';


const routes: Routes = [
  // {path:'', redirectTo:'home', pathMatch:'full'},
  { 
    path: 'home', component:AppComponent,   
    data: {roles : ['user','admin']},
    canActivate: [AuthGuard],  
  },
  {
    path: 'forbiden', 
    component:ForbidenComponent},
  {
    path: 'user', 
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    data: {roles : ['user','admin']},
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers:[],
  exports: [RouterModule]
})
export class AppRoutingModule { }
