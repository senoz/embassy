import {map, distinctUntilChanged,  debounceTime} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.component.html',
  styleUrls: ['./my-customers.component.css']
})
export class MyCustomersComponent implements OnInit {
  page = 1;
  pageSize = 10;
  address = [];
  users: any;
  filterUsers: any;
  constructor(
    private authService: AuthenticateService,
    private addressService: AddressService
  ) {
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

  ngOnInit() {
    this.users = this.authService.users.filter(user => user.isSuperAdmin === false && user.isAdmin === false);
    this.filterUsers = Object.assign(this.users, {});
  }

  getAddressByUserId(userId) {
    let address;
    const data = {
      apartment: '',
      block: '',
      doorNumber: ''
    };
    if (this.address) {
      address = this.address.filter(add => add.userId === userId)[0];
    }
    return address ? address : data;
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
