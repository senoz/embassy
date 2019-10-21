import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ProductsService } from '../../services/products.service';
import { GenericService } from '../../services/generic.service';
import { Subscription } from 'rxjs';
import { Order } from '../../models/order.model';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-pending-can',
  templateUrl: './pending-can.component.html',
  styleUrls: ['./pending-can.component.css']
})
export class PendingCanComponent implements OnInit, OnDestroy, AfterViewChecked {
  totalReturn: any;
  private subscription: Subscription;
  modalReference: NgbModalRef;
  orders: any[] = [];
  page = 1;
  pageSize = 10;
  model: any = {
    return: 0
  };
  isPendingCan = false;
  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private genericService: GenericService,
    private alert: AlertService,
    private changeDetector: ChangeDetectorRef,
    private modalService: NgbModal
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
            const filterOrder = this.orders.filter( data => data.userId === order.userId);
            if (filterOrder.length) {
              filterOrder[0].quantity += order.quantity;
              filterOrder[0].return += order.return;
              filterOrder[0].advanceCan += order.advanceCan;
            } else {
              if (!order.isAdvancePaid) {
                this.orders.push(order);
              }
            }
          }
        }
      }
    });
  }

  open(content, returnItem, userId) {
    this.totalReturn = returnItem;
    this.model.return = returnItem;
    this.model.userId = userId;
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  manageReturn(type) {
    if (type) {
      this.model.return++;
    } else {
      this.model.return--;
    }
  }

  getPendingCan(userId) {
    for (const key in this.orders) {
      if (this.orders[key].userId === userId) {
        const pendingcount = (this.orders[key].quantity - this.orders[key].advanceCan) - this.orders[key].return;
        if (pendingcount) {
          this.isPendingCan = true;
        }
        return pendingcount;
      }
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  onSubmit() {
    this.subscription = this.orderService.getReceivedCanUser(this.model.userId).subscribe( data => {
      if (data.length) {
        const order = data[0].payload.doc.data() as Order;
        const orderId = data[0].payload.doc.id;
        const returnCan = order.return + this.model.return;
        if (this.orderService.setReceivedCanUser(orderId, returnCan)) {
          this.subscription.unsubscribe();
       }
        this.alert.success('Updated successfully');
        setTimeout(() => {
          this.alert.blurMessage();
          this.modalReference.close();
        }, 1000);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
