import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { ForbidenComponent } from './modules/forbiden/forbiden.component';


const routes: Routes = [
  // {path:'', redirectTo:'home', pathMatch:'full'},
  {path: 'home', component:AppComponent },
  {path: 'forbiden', component:ForbidenComponent},
  {path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
  canDeactivate: [AuthGuard],
  data: {roles : ["user"]}
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
