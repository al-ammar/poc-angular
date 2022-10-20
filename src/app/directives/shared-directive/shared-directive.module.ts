import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpperPatternDirective } from '../upper-pattern.directive';



@NgModule({
  declarations: [
    UpperPatternDirective
  ],
  imports: [
    CommonModule
  ], 
  exports : [
    UpperPatternDirective
  ]
})
export class SharedDirectiveModule { }
