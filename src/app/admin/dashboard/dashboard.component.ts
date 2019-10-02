import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { Order } from '../../models/order.model';
import { ProductsService } from '../../services/products.service';
import { Products } from '../../models/products.model';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from '../../models/coupon.model';
import { totalmem } from 'os';
import { UsersService } from '../../services/users.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  modalReference: NgbModalRef;
  download = [];
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
  downloadType = {
    product: '',
    qty: 0,
    apartment: '',
    block: '',
    doorNumber: '',
    floor: 0,
    total: 0
  };
  closeResult: string;
  private subscription: Subscription;
  constructor(
    private modalService: NgbModal,
    private orderService: OrderService,
    private authService: AuthenticateService,
    private productsService: ProductsService,
    private alert: AlertService,
    private router: Router
  ) {
    this.productsService.getProducts().subscribe(product => {
      this.product = [];
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

  downloadFile() {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(this.download[0]);
    let csv = this.download.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], {type: 'text/csv'});
    const dataURL = window.URL.createObjectURL(blob);

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'today-delivery-item.csv';
    link.click();

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(dataURL);
      }, 100);
}

  getProductById(productId) {
    for (const key in this.product) {
      if (this.product[key].id === productId) {
        return this.product[key].name;
      }
    }
  }

  getOrderById(orderId) {
    for (const key in this.orders) {
      if (this.orders[key].id === orderId) {
        return this.orders[key];
      }
    }
  }

  getUserFirstNameById(userId) {
    for (const key in this.authService.users) {
      if (this.authService.users[key].id === userId) {
        return this.authService.users[key].name;
      }
    }
  }

  ngOnInit() {
    this.subscription = this.orderService.getUnDeliveredOrders()
    .subscribe(orders => {
      this.orders = [];
      this.download = [];
      if (orders.length) {
        for (const key in orders) {
          if (orders[key]) {
            const order = orders[key].payload.doc.data() as Order;
            order.id = orders[key].payload.doc.id;
            this.orders.push(order);
            this.downloadType.product = this.getProductById(order.productId);
            this.downloadType.qty = order.quantity;
            this.downloadType.apartment = order.address.apartmentName;
            this.downloadType.block = order.address.block;
            this.downloadType.doorNumber = order.address.doorNumber;
            this.downloadType.floor = order.address.floor;
            this.downloadType.total = order.total;
            this.download.push(this.downloadType);
          }
        }
      }
    });
  }

  open(content, orderId) {
    this.model = this.getOrderById(orderId);
    this.model.return = this.model.quantity;
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
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
    this.orderService.deliverOrder(this.model);
    this.alert.success('Order has delivered successfully');
    setTimeout(() => {
      this.alert.blurMessage();
      this.modalReference.close();
    }, 1000);
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
