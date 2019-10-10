import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ProductsService } from '../../services/products.service';
import { GenericService } from '../../services/generic.service';
import { Order } from '../../models/order.model';
import { Subscription } from '../../../../node_modules/rxjs';
import { ConstantsService } from '../../services/constants.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-pending-amount',
  templateUrl: './pending-amount.component.html',
  styleUrls: ['./pending-amount.component.css']
})
export class PendingAmountComponent implements OnInit, OnDestroy {
  modalReference: NgbModalRef;
  orders: any[] = [];
  page = 1;
  pageSize = 10;
  private subscription: Subscription;
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

  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private genericService: GenericService,
    private globals: ConstantsService,
    private modalService: NgbModal,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.subscription = this.orderService.getPendingAmountOrders()
      .subscribe(orders => {
        this.orders = [];
        if (orders.length) {
          for (const key in orders) {
            if (orders[key]) {
              const order = orders[key].payload.doc.data() as Order;
              order.id = orders[key].payload.doc.id;
              const filterOrder = this.orders.filter( data => data.userId === order.userId);
              if (filterOrder.length) {
                filterOrder[0].total += order.total;
              } else {
                this.orders.push(order);
              }
            }
          }
        }
      });
  }

  paidAmount(userId) {
    if (confirm('Is he paid?')) {
      this.orderService.setPaidUser(userId);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
