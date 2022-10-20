import { AbstractControl, ValidatorFn } from "@angular/forms";
import { Utils } from "../utils/ArrayUtils";

export function required(){
    return function validate(control: AbstractControl){
        console.log('required'); 
        if(Utils.isEmpty(control.value)){
            console.log('required'); 
            return {required: true} ;
        }
        return null;
    };
}