import { Injectable } from '@angular/core';
import { GlobalVariables } from '../_constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }
  gpayNumber = GlobalVariables.gpayNumber;
}
