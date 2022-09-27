import { Injectable } from '@angular/core';
import {remove} from 'lodash';



@Injectable()
export class ArrayUtils {

  public static remove(array: any, predicate?: any): any[] {
    return remove(array, predicate);
  }
}