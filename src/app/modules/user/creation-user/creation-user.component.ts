import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from 'src/app/models/user';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-creation-user',
  templateUrl: './creation-user.component.html',
  styleUrls: ['./creation-user.component.scss']
})
export class CreationUserComponent implements OnInit {
  public validateForm!: UntypedFormGroup;
  @Output() doneCreation = new EventEmitter<boolean>();

  constructor(private fb: UntypedFormBuilder,
              private service: SharedService,
              private route: Router,
              private notification: NzNotificationService) { }


  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      creationDate:[],
      updateDate:[]
    });

  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const user :User = new User();
      user.userName = this.validateForm.value.username;
      user.firstName = this.validateForm.value.firstName;
      user.lastName = this.validateForm.value.lastName;
      user.password = this.validateForm.value.password; 
      user.creationDate = this.validateForm.value.creationDate;
      user.updateDate = this.validateForm.value.updateDate;
      this.service.createUser(user).subscribe({
        next:(res:void) =>{
          console.log(res);
          this.notification.success("Création utilisateur", "La création a été executée avec succès");
          this.doneCreation.emit(true);
        },
        error:(err: Error) =>{
          this.notification.error("Création utilisateur", "Un problème est survenu lors de la création utilisateur");
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
    this.doneCreation.emit(true);
  }
}
