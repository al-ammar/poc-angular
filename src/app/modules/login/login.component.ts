import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, SessionUser } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
      private fb: FormBuilder,
      private auth : AuthService,
      private router : Router
  ) {
    this.form = this.fb.group({
      email:['', Validators.required], 
      password: ['', Validators.required],
      remember: [true]  });
   }



   login(){
    if (!this.form.valid) {      
        Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          return;
        }
      });
    } else{
  
    const val = this.form.value;
    if(val.email && val.password){
      this.auth.login(val.email, val.password).subscribe(
        (res: SessionUser)=>{
          // this.auth.loginKeycloak();
          console.log('Appel Login rest');
          localStorage.setItem('user', res.userName!);
          localStorage.setItem('isAuth', String(res.authenticated));  
          this.auth.canUserAccess(res.authenticated);
          this.router.navigate(['./'],{ queryParams: {user:this.form.value.email} }).then();
        }
      );
    }
    }
   }

  ngOnInit(): void {
    // if(localStorage.getItem('isAuth') === 'true'){
      // this.router.navigate(['./accueil']).then();
    // }
  }

}
