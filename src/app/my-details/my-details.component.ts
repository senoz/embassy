import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';
import { Order } from '../models/order.model';
import { UsersService } from '../services/users.service';
import { Users } from '../models/users.model';
import { GenericService } from '../services/generic.service';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.css']
})
export class MyDetailsComponent implements OnInit {
  totalAdvanceCan = 0;
  page = 1;
  pageSize = 10;
  currentUser = {
    name: ''
  } as Users;
  orders = [];
  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private userService: UsersService,
    private genericService: GenericService,
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');

    this.userService.getUserById(userId).subscribe(data => {
      if (data.length) {
        this.currentUser = data[0].payload.doc.data() as Users;
      }
    });
    this.orderService.getDeliveredNotCancelledOrdersByUserId(userId).subscribe(data => {
      this.orders = [];
      if (data.length) {
        for (const key in data) {
          if (data[key]) {
            const order = data[key].payload.doc.data() as Order;
            order.id = data[key].payload.doc.id;
            this.orders.push(order);
          }
        }
      }
    });
  }

  getTotalPendingAmount() {
    const userId = localStorage.getItem('userId');
    let amt = 0;
    for (const key in this.orders) {
      if (this.orders[key].userId === userId
        && this.orders[key].isPaid === false) {
        amt += this.orders[key].total;
      }
    }
    return amt;
  }

  getTotalPendingCan() {
    const userId = localStorage.getItem('userId');
    let totalQty = 0;
    let totalReceived = 0;
    for (const key in this.orders) {
      if (this.orders[key].userId === userId && this.orders[key].isAdvancePaid) {
        this.totalAdvanceCan += this.orders[key].advanceCan;
      }
      if (this.orders[key].userId === userId) {
        const returnCount = this.orders[key].return ? this.orders[key].return : 0;
        totalQty += this.orders[key].quantity;
        totalReceived += returnCount;
      }
    }
    return (totalQty - (totalReceived + this.totalAdvanceCan));
  }
}
