import { Injectable } from '@angular/core';
import { AuthenticateService } from './authenticate.service';
import { OrderService } from './order.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(
    private authService: AuthenticateService,
    private orderService: OrderService,
    private alert: AlertService,
  ) { }

  getProductById(productId, products) {
    for (const key in products) {
      if (products[key].id === productId) {
        return products[key].name;
      }
    }
  }

  getOrderById(orderId, orders) {
    for (const key in orders) {
      if (orders[key].id === orderId) {
        return orders[key];
      }
    }
  }

  cancelOrder(orderId) {
    if (confirm('Are you sure to cancel order?')) {
      this.orderService.cancelOrder(orderId);
      this.alert.success('Order has cancelled successfully');
      setTimeout(() => {
        this.alert.blurMessage();
      }, 2000);
    }
  }

  getUserFirstNameById(userId) {
    for (const key in this.authService.users) {
      if (this.authService.users[key].id === userId) {
        return this.authService.users[key].name;
      }
    }
  }
}
