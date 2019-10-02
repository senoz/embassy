import { Injectable } from '@angular/core';
import { GlobalVariables } from '../_constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }
  gpayNumber = GlobalVariables.gpayNumber;
  defaultApartment = GlobalVariables.defaultApartment;
  twilioNumber = GlobalVariables.twilioNumber;
  accountSid = GlobalVariables.accountSid;
  authToken = GlobalVariables.authToken;
  whatsappGroup = GlobalVariables.whatsappGroup;
  whatsappContent = GlobalVariables.whatsappContent;
}
