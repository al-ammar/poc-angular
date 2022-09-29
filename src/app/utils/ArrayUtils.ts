import { Injectable } from '@angular/core';
import {remove} from 'lodash';
import {size} from 'lodash';

import {isNil} from 'lodash';
import { isEmpty } from 'lodash';



@Injectable()
export class Utils {

  public static size(array: any): number {
    return size(array);
  }

  public static remove(array: any, predicate?: any): any[] {
    return remove(array, predicate);
  }

  public static isEmpty(val: any): boolean {
    return (this.isNull(val) || val === '') && isEmpty(val);
  }

  public static isNull(val: any): boolean {
    return isNil(val);
  }
}