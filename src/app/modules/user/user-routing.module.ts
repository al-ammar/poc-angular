import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthorizationsGuard } from 'src/app/guards/autirizations.guard';
import { CreationUserComponent } from './creation-user/creation-user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [  
  {
    path:'users', 
    component:UsersComponent,
    data: {roles : ['user','admin']},
    canActivate: [AuthGuard],
  },
  {
    path:'users/creation', 
    component:CreationUserComponent,
    data: {roles : ['user','admin']},
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
