import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { CreationUserComponent } from './creation-user/creation-user.component';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzAntdModule } from 'src/app/shared/modules/nz-antd/nz-antd.module';


@NgModule({
  declarations: [
    CreationUserComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzAntdModule,
  ]
})
export class UserModule { }
