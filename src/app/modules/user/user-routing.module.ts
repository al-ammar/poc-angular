import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreationUserComponent } from './creation-user/creation-user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [  
  {path:'users', component:UsersComponent},
  {path:'users/creation', component:CreationUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
