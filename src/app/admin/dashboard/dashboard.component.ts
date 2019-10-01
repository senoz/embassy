import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { Order } from '../../models/order.model';
import { ProductsService } from '../../services/products.service';
import { Products } from '../../models/products.model';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from '../../models/coupon.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  orders = [];
  product = [];
  model: any = {
    userId: localStorage.getItem('userId'),
    quantity: 1,
    return: 0,
    address: {
      apartmentName: 'Embassy Residency',
      doorNumber: '',
      block: '',
      floor: '',
    },
    productId: '',
    isPaid: false,
    isDelivered: false,
    paymentType: 'cod',
    total: 30,
    isCancelled: false,
    isPromotionApplied: false,
    promotionCode: ''
  };
  closeResult: string;
  private subscription: Subscription;
  constructor(private modalService: NgbModal, private orderService: OrderService, private productsService: ProductsService) {
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

  getProductById(productId) {
    for (const key in this.product) {
      if (this.product[key].id === productId) {
        return this.product[key].name;
      }
    }
  }

  ngOnInit() {
    this.subscription = this.orderService.getUnDeliveredOrders()
    .subscribe(orders => {
      if (orders.length) {
        for (const key in orders) {
          if (orders[key]) {
            const order = orders[key].payload.doc.data() as Order;
            this.orders.push(order);
          }
        }
      }
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onSubmit() {

  }


  manageQuantity(type) {
    if (type) {
      this.model.quantity++;
    } else {
      this.model.quantity--;
    }
  }

  manageReturn(type) {
    if (type) {
      this.model.return++;
    } else {
      this.model.return--;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
