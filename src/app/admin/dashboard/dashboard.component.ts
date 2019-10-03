import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { Order } from '../../models/order.model';
import { ProductsService } from '../../services/products.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';
import { GenericService } from '../../services/generic.service';
import { ConstantsService } from '../../services/constants.service';

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
      apartmentName: this.globals.defaultApartment,
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
    private productsService: ProductsService,
    private genericService: GenericService,
    private alert: AlertService,
    private globals: ConstantsService
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
              this.downloadType.product = this.genericService.getProductById(order.productId, this.productsService.product);
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
    this.model = this.genericService.getOrderById(orderId, this.orders);
    this.model.return = this.model.quantity;
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
