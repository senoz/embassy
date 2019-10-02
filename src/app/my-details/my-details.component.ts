import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';
import { Order } from '../models/order.model';
import { UsersService } from '../services/users.service';
import { Users } from '../models/users.model';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.css']
})
export class MyDetailsComponent implements OnInit {
  currentUser = {
    name: ''
  } as Users;
  orders = [];
  product = [];
  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private userService: UsersService
  ) {
    this.productsService.getProducts().subscribe(productData => {
      this.product = [];
      if (productData.length) {
        for (const key in productData) {
          if (productData[key]) {
            const prod = productData[key].payload.doc.data() as Products;
            prod.id = productData[key].payload.doc.id;
            this.product.push(prod);
          }
        }
      }
    });
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    
    this.userService.getUserById(userId).subscribe(data => {
      if (data.length) {
        this.currentUser = data[0].payload.doc.data() as Users;
      }
    });
    this.orderService.getOrdersByUserId(userId).subscribe(data => {
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

  getProductById(productId) {
    for (const key in this.product) {
      if (this.product[key].id === productId) {
        return this.product[key].name;
      }
    }
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
      if (this.orders[key].userId === userId) {
        totalQty += this.orders[key].quantity;
        totalReceived += this.orders[key].return;
      }
    }
    return (totalQty - totalReceived);
  }
}
