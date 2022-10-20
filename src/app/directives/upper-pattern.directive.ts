import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isNumber } from 'lodash';
import { map, Observable, pairwise, startWith, Subscriber, Subscription } from 'rxjs';

@Directive({
  selector: '[appUpperPattern]'
})
export class UpperPatternDirective implements OnInit, OnDestroy {

  @Input() cusPattern?: string;
  @Input() toUpper = true;
  @Input() maxLength? : number;
  @Input() enablePat = true;
  @Input() typePattern? : string;

  private subs = new Subscription();


  constructor(private control : NgControl) { }

  ngOnInit(): void {

    switch (this.typePattern) {
      case 'alpha':
        this.cusPattern = '[^a-zA-Z]';
        break;
      case 'alphaNum':
        this.cusPattern = '[^a-zA-Z0-9]';
        break;
      case 'email':
        this.cusPattern = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' +
        '\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
        break;
      case 'numeric':
        this.cusPattern = '[^0-9]';
        break;
       default:
        break;
    }

    if(this.enablePat){
      this.pattern();
    }
  }

  public pattern(){

  //   Object.keys(this.control).forEach(key => {
  //     this.control[key].valueChanges.pipe(startWith(null), pairwise())
  //     .subscribe(([prev, next]: [any, any]) => {
  //         console.log(key) // your FormControl Identifier 
  //         console.log('PREV2', prev);
  //         console.log('NEXT2', next);
  //     });
  // });
    console.log(this.control.name);
    this.subs = (this.control.valueChanges?.pipe(
      map( (res: string | number)  => {
        if(res == null){
          return res;
        }
        let strValue = res.toString();
        if(!!this.maxLength && (strValue.length > this.maxLength)){
          const rm = strValue.length - this.maxLength;
          strValue = strValue.slice(0, -rm);
        }
        if(this.toUpper){
          strValue = strValue.toUpperCase();
        }
        if(this.cusPattern !== undefined){
          strValue = strValue.replace(new RegExp(this.cusPattern, 'g'), '');
        }
        return isNumber(res) ? parseInt(strValue): strValue;
      })
    ))?.subscribe({
      next: (value : string | number) => {
        if(value !== this.control?.control?.value){
          this.control.control?.setValue(value, {emitEvent: false});
          this.control.control?.markAsUntouched();
        }
      }
  }) as Subscription;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
