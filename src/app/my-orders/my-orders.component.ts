import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { GenericService } from '../services/generic.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Array<any> = [];
  cols: { field: string; header: string; }[];
  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private alert: AlertService,
    private router: Router,
    private genericService: GenericService,
  ) { }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
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
    this.cols = [
      { field: 'Date', header: 'Date' },
      { field: 'Product', header: 'Product' },
      { field: 'Qty', header: 'Qty' },
      { field: 'Total', header: 'Total' },
      { field: 'Status', header: 'Status' },
      { field: '', header: '' },
      { field: '', header: '' }
    ];
  }

  getOrderStatus(order: Order) {
    if (order.isDelivered) {
      return 'Delivered';
    } else if (order.isCancelled) {
      return 'Cancelled';
    } else {
      return 'In Progress';
    }
  }
}
