import { AbstractControl, FormGroup } from "@angular/forms";

export function isDifferent(key: string){
    return function validate (control: AbstractControl){
        // const f = control.parent as FormGroup;
        const  f = control["_parent"];
        if(f !== null){
        const valueField = f.get(key)!.value;
        if(valueField !== null && valueField === control.value){
            return {identique : true, keyIdentique : key};
        }}
        return null;
    }
}