import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  @Input() userToUpdate?: User ;
  public validateForm!: UntypedFormGroup;
  @Output() doneUpdate = new EventEmitter<boolean>(false);

  constructor(private fb: UntypedFormBuilder,
    private service: SharedService,
    private route: Router,
    private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [this.userToUpdate?.userName, [Validators.required]],
      password: [this.userToUpdate?.password, [Validators.required]],
      lastName: [this.userToUpdate?.lastName, [Validators.required]],
      firstName: [this.userToUpdate?.firstName, [Validators.required]],
      creationDate:[this.userToUpdate?.creationDate],
      updateDate:[this.userToUpdate?.updateDate]

    });
  }

  submitForm(){

    if (this.validateForm.valid) {
      const user :User = new User();
      user.id = this.userToUpdate?.id; 
      if (this.validateForm.controls['username'].dirty) {
        user.userName = this.validateForm.value.username;
      } else {
        user.userName = this.userToUpdate!.userName;
      }
      if (this.validateForm.controls['password'].dirty) {
        user.password = this.validateForm.value.password;
      } else {
        user.password = this.userToUpdate!.password;
      }
      user.lastName = this.validateForm.value.lastName;
      user.firstName = this.validateForm.value.firstName;
      user.creationDate = this.validateForm.value.creationDate;
      user.updateDate = this.validateForm.value.updateDate;
      this.service.updateUser(user.id!,user).subscribe({
        next:(res:void) =>{
          console.log(res);
          this.notification.success("Modification utilisateur", "La modification a été executée avec succès");
          this.route.navigate(['./users']).then();
          this.doneUpdate.emit(true);
        },
        error:(err: Error) =>{
          this.notification.error("Modification utilisateur", "Un problème est survenu lors de la modification utilisateur");
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public back(){
    this.route.navigate(['./users']).then();
    this.doneUpdate.emit(true);
  }

}
