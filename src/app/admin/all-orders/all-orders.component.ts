import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { GenericService } from '../../services/generic.service';
import { OrderService } from '../../services/order.service';
import { Subscription } from 'rxjs';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  orders: any[];
  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    this.subscription = this.orderService.getDeliveredOrders()
    .subscribe(orders => {
      this.orders = [];
      if (orders.length) {
        for (const key in orders) {
          if (orders[key]) {
            const order = orders[key].payload.doc.data() as Order;
            order.id = orders[key].payload.doc.id;
            this.orders.push(order);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
