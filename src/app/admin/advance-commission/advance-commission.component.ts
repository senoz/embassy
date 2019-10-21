import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { Order } from '../../models/order.model';
import { GenericService } from '../../services/generic.service';
import { Commission } from '../../models/commission.model';
import { UsersService } from '../../services/users.service';
import { Users } from '../../models/users.model';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
  selector: 'app-advance-commission',
  templateUrl: './advance-commission.component.html',
  styleUrls: ['./advance-commission.component.css']
})
export class AdvanceCommissionComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  orders: any[] = [];
  commission: any;
  totalCount = 0;
  amountRecieved = 0;
  page = 1;
  pageSize = 10;
  constructor(
    private orderService: OrderService,
    private userService: UsersService,
    public authService: AuthenticateService,
    private genericService: GenericService,
  ) {
    this.orderService.getCommissionAmount().subscribe(c => {
      if (c.length) {
       const commission = c[0].payload.doc.data() as Commission;
       this.commission = commission.amount;
      }
    });
    this.userService.getSuperAdminUserId().subscribe( users => {
      if (users.length) {
        const user = users[0].payload.doc.data() as Users;
        this.orderService.getCommissionNotPaidOrders().subscribe(orders => {
          if (orders.length) {
            this.totalCount = orders.length;
            for (const key in orders) {
              if (orders[key]) {
                const order = orders[key].payload.doc.data() as Order;
                const userId = order.amountReceivedBy;
                if (user.id === userId) {
                  this.amountRecieved += order.total;
                }
              }
            }
          }
        });
      }
    });
  }

  ngOnInit() {
    this.subscription = this.orderService.getAdvancePaidOrders()
    .subscribe(orders => {
      this.orders = [];
      if (orders.length) {
        for (const key in orders) {
          if (orders[key]) {
            const order = orders[key].payload.doc.data() as Order;
            order.id = orders[key].payload.doc.id;
            const filterOrder = this.orders.filter( data => data.userId === order.userId);
            if (filterOrder.length) {
              filterOrder[0].advanceCan += order.advanceCan;
            } else {
              this.orders.push(order);
            }
          }
        }
      }
    });
  }

  getAmountDue() {
    return this.amountRecieved - (this.commission * this.totalCount);
  }

  settlement() {
    if (confirm('Are you sure')) {
      this.orderService.settleCommission();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
