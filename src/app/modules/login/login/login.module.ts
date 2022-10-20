import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { initalizer } from '../keycloack-initializer';



@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
  ]

})
export class LoginModule { }
