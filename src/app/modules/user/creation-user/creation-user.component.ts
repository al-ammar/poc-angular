import { Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgControl, NG_VALUE_ACCESSOR, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormControlComponent, NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ConstPattern } from 'src/app/constants/constants';
import { User } from 'src/app/models/user';
import { Document } from 'src/app/models/user';
import { FormValidationService } from 'src/app/services/form-validation.service';

import { SharedService } from 'src/app/services/shared.service';
import { Utils } from 'src/app/utils/ArrayUtils';
import { required } from 'src/app/validators/required';
import { isDifferent } from '../../../validators/isDiffrent';

enum FieldType {
  lastName ='lastName',
  firstName = 'firstName', 
  usernameField = 'usernameField',
  passwordField = 'passwordField',
  creationDate = 'creationDate',
  updateDate = 'updateDate'
}

@Component({
  selector: 'app-creation-user',
  templateUrl: './creation-user.component.html',
  styleUrls: ['./creation-user.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CreationUserComponent), multi: true}
  ]
})
export class CreationUserComponent implements OnInit {

  @ViewChild('errorTipFile') errorTipFile? : TemplateRef<any>;

  public messagesError: string = '';
  public fieldType = FieldType;

  public validateForm!: FormGroup;
  @Output() doneCreation = new EventEmitter<boolean>();

  public document? : NzUploadFile;
  public fileList : NzUploadFile[] = [];

  // Input directive
  public cusPattern? : string;
  public toUpper = true;
  public maxLength = '36';
  public enablePat = true;
  public typePattern = 'email';

  constructor(
              private injector : Injector , 
              private service: SharedService,
              private route: Router,
              private notification: NzNotificationService) { }


  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  ngOnInit(): void {
    this.validateForm = new FormGroup({
      lastName: new FormControl(null, [ required(), isDifferent('firstName'), Validators.maxLength(10), Validators.minLength(2)]),
      firstName: new FormControl(null, [required(), isDifferent('lastName'), Validators.maxLength(10), Validators.minLength(2)]),
      usernameField: new FormControl(null, [required(),  isDifferent('passwordField'), Validators.pattern(ConstPattern.email), Validators.minLength(2)]),
      passwordField: new FormControl(null, [required(),  isDifferent('usernameField'), Validators.minLength(2), Validators.minLength(16)]),
      creationDate:new FormControl(null, [required()], null),
      updateDate:new FormControl(null, [required()], null)
    });

  }

  submitForm(): void {
    
    if (this.validateForm.valid && Utils.size(this.fileList) > 0) {
      const user :User = new User();
      user.userName = this.validateForm.value.usernameField;
      user.firstName = this.validateForm.value.firstName;
      user.lastName = this.validateForm.value.lastName;
      user.password = this.validateForm.value.passwordField; 
      user.creationDate = this.validateForm.value.creationDate;
      user.updateDate = this.validateForm.value.updateDate;
      this.service.createUser(user, this.document!).subscribe({
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
      FormValidationService.performValidate(this.validateForm);
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });    
        }
      });
      if(Utils.size(this.fileList) <= 0){
        this.messagesError='Attention, au moins une pièce doit être attacher';
      } else{
        this.messagesError = '';
      }
    }
  }

  public back(){
    this.doneCreation.emit(true);
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]) =>{
    return new Observable((observer: Observer<boolean>) => {
      this.document = file;
      this.fileList.push(file);
      observer.complete();
      return ;
    });
  }


  public getErrors(s: string): any {
    console.log('getError');
    console.log(s);
    let control = this.validateForm.get(s);
    return FormValidationService.validate(control!);
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange: any = () => { };
  onTouched: any = () => { };
}
