import {Subscription} from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class DashboardComponent implements OnDestroy {
  currentOrder = [];
  products: AngularFirestoreCollection<Products>;
  private subscription: Subscription;
  private orderSubscription : Subscription;
  constructor(
    private orderService: OrderService,
    private productsServices: ProductsService
  ) {
    this.subscription = this.productsServices.getProducts().subscribe(data => {
      this.products = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Products;
      });
      this.orderSubscription = this.orderService.getUnDeliveredOrders()
      .subscribe(orders => {
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
        return this.currentOrder[key].id;
      }
    }
    return false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.orderSubscription.unsubscribe();
  }

}
