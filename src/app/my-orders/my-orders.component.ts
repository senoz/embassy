import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders = [];
  product = [];

  constructor(
    private order: OrderService,
    private productsService: ProductsService
  ) {
    this.productsService.getProducts().subscribe(product => {
      if (product.length) {
        for (const key in product) {
          if (product[key]) {
            const prod = product[key].payload.doc.data() as Products;
            prod.id = product[key].payload.doc.id;
            this.product.push(prod);
          }
        }
      }
    });
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.order.getOrdersByUserId(userId).subscribe(data => {
      if (data.length) {
        for (const key in data) {
          if (data[key]) {
            this.orders.push(data[key].payload.doc.data() as Order);
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
