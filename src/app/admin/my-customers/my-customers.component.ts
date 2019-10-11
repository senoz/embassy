import {map, distinctUntilChanged,  debounceTime} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import { Component } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.css']
})
export class MyCustomersComponent {
  page = 1;
  pageSize = 10;
  address = [];
  users: any;
  filterUsers: any;
  constructor(
    private authService: AuthenticateService,
    private addressService: AddressService
  ) {
    this.users = this.authService.users;
    this.filterUsers = Object.assign(this.users, {});
    this.addressService.getAllAddresses()
      .subscribe(addresses => {
        if (addresses.length) {
          for (const key in addresses) {
            if (addresses[key]) {
              this.address.push(addresses[key].payload.doc.data() as Address);
            }
          }
        }
      });
  }

  getAddressByUserId(userId) {
    return this.address.filter(add => add.userId === userId)[0];
  }

  filterUser(key) {
    if (key.length >= 2) {
      this.filterUsers = this.users.filter(
        v => v.name.toLowerCase().indexOf(key.toLowerCase()) > -1);
    } else {
      this.filterUsers = Object.assign(this.users, {});
    }
  }
}
