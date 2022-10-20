import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, NgControl, ValidationErrors } from '@angular/forms';
import { ConstPattern } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  public static performValidate(formGroup: FormGroup | FormArray): void {
    formGroup.markAllAsTouched();
    formGroup.updateValueAndValidity();
  }

  public static validate(control: AbstractControl) : string{   
    if(control === undefined){
      return '';  
    }
    if((control.dirty || control.touched) && control.errors){
      control.markAsDirty({onlySelf: true});
      const allError = control.errors;
      if(!! allError){
        const errorType = Object.keys(allError)[0];
        const errorValue = allError[errorType];
        const listErrors = {
          required : 'Donnée obligatoire non saisie',
          minlength : 'Donnée de taille ' + errorValue.requiredLength + ' minimum',
          maxlength : 'Donnée de taille ' + errorValue.requiredLength + ' maximum',
          email : 'Format mail est invalide ',
          pattern: this.getMessage(errorValue.requiredPattern),
          identique: this.getIdentiqueMessage(allError),
        }
        const k : keyof typeof listErrors = errorType as any;
        return listErrors[k];
      }
    }
    return '';
  }

  static getIdentiqueMessage(list : ValidationErrors): string{
    console.log(list);
    let s = list['keyIdentique'];
    return 'Attention, les champs '+ s+' ont des valeurs identiques';
  }

  static getMessage(t: string ): string{
    switch (t) {
        case ConstPattern.telephoneFr:
            return 'Numéro non conforme' as string;
          case ConstPattern.codeNaf:
            return 'Code NAF non conforme' as string;
          case ConstPattern.email:
            return 'Email non conforme' as string;
          case ConstPattern.dateFormat:
            return 'La date n\'est pas au bon format.' as string;
          default:
            return '' as string;
    }
  }
}
