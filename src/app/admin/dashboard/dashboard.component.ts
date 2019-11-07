import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from '../../../../node_modules/rxjs';

import { ProductsService } from '../../services/products.service';
import { AlertService } from '../../services/alert.service';
import { GenericService } from '../../services/generic.service';
import { ConstantsService } from '../../services/constants.service';
import { UsersService } from '../../services/users.service';
import { OrderService } from '../../services/order.service';

import { Users } from '../../models/users.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  modalReference: NgbModalRef;
  page = 1;
  pageSize = 10;
  download = [];
  orders = [];
  product = [];
  model: any = {};
  downloadType = {
    product: '',
    qty: 0,
    apartment: '',
    block: '',
    doorNumber: '',
    floor: 0,
    total: 0,
    paymentType: ''
  };
  closeResult: string;
  private subscription: Subscription;
  private walletSubscribe: Subscription;
  constructor(
    private modalService: NgbModal,
    private orderService: OrderService,
    private productsService: ProductsService,
    private genericService: GenericService,
    private alert: AlertService,
    private globals: ConstantsService,
    private userService: UsersService
  ) {
  }

  downloadFile() {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(this.download[0]);
    const csv = this.download.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], { type: 'text/csv' });
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
              this.downloadType = {
                product: this.genericService.getProductById(order.productId, this.productsService.product),
                apartment: order.address.apartmentName,
                block: order.address.block,
                doorNumber: order.address.doorNumber,
                floor: order.address.floor,
                total: order.total,
                qty: order.quantity,
                paymentType: order.paymentType,
              };
              this.download.push(this.downloadType);
            }
          }
        }
      });
  }

  open(content, orderId) {
    this.model = this.genericService.getOrderById(orderId, this.orders);
    this.model.return = this.model.quantity;
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit() {
    let isNewCustomer;
    let isAddressExists = 0;
    this.orderService.isAddressExists(this.model.address).subscribe(data => {
      isAddressExists = data.length;
    });
    this.orderService.isOrderExists(this.model.userId).subscribe(data => {
      isNewCustomer = data.length;
    });
    if (this.model.isPaid) {
      this.model.amountReceivedBy = localStorage.getItem('adminUser');
    }
    this.orderService.deliverOrder(this.model);
    this.walletSubscribe = this.userService.getUserById(this.model.userId).subscribe(data => {
      if (data.length) {
        const user = data[0].payload.doc.data() as Users;
        user.id = data[0].payload.doc.id;
        if (user.refferedBy && isNewCustomer <= 1 && isAddressExists === 1) {
          const walletAmount = user.wallet + 10;
          this.userService.setWalletAmount(user.refferedBy, walletAmount);
        }
        if (this.model.walletPending) {
          const walletAmount = user.wallet + this.model.walletPending;
          this.userService.setWalletAmount(user.id, walletAmount);
        }
        this.walletSubscribe.unsubscribe();
      }
    });
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

  manageAdvanceCan(type) {
    if (!this.model.advanceCan) {
      this.model.advanceCan = 0;
    }
    if (type) {
      this.model.advanceCan++;
    } else {
      this.model.advanceCan--;
    }
    this.model.return = this.model.quantity - this.model.advanceCan;
  }

  resetAdvance() {
    this.model.advanceCan = 0;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
