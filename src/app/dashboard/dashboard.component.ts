import {Subscription} from 'rxjs';
import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentOrder = [];
  orderedProducts = [];
  products: AngularFirestoreCollection<Products>;
  private subscription: Subscription;
  private orderSubscription: Subscription;
  userId: string;
  constructor(
    private orderService: OrderService,
    private productsServices: ProductsService
  ) {
    this.userId = localStorage.getItem('userId');
    this.subscription = this.productsServices.getProducts().subscribe(data => {
      this.products = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Products;
      });
      this.orderSubscription = this.orderService.getPendingOrdersByUserId(this.userId)
      .subscribe(orders => {
        this.currentOrder = [];
        if (orders.length) {
          for (const key in orders) {
            if (orders[key]) {
              const order = orders[key].payload.doc.data() as Order;
              order.id = orders[key].payload.doc.id;
              this.currentOrder.push(order);
            }
          }
        }
      });
    });
  }

  getOrderByProdId(id) {
    for (const key in this.currentOrder) {
      if (this.currentOrder[key].productId === id) {
        return true;
      }
    }
    return false;
  }

  ngOnDestoy() {
    this.orderSubscription.unsubscribe();
  }
}
