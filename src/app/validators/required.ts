import { AbstractControl, ValidatorFn } from "@angular/forms";
import { Utils } from "../utils/ArrayUtils";

export function required(){
    return function validate(control: AbstractControl){
        if(Utils.isEmpty(control.value)){
            return {required: true} ;
        }
        return null;
    };
}