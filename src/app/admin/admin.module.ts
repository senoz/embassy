import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { PendingAmountComponent } from './pending-amount/pending-amount.component';
import { PendingCanComponent } from './pending-can/pending-can.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyCustomersComponent } from './my-customers/my-customers.component';
import { AdvanceCommissionComponent } from './advance-commission/advance-commission.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'pending-amount',
        component: PendingAmountComponent
      },
      {
        path: 'pending-can',
        component: PendingCanComponent
      },
      {
        path: 'all-orders',
        component: AllOrdersComponent
      },
      {
        path: 'my-customers',
        component: MyCustomersComponent
      },
      {
        path: 'advance-commission',
        component: AdvanceCommissionComponent
      },
    ]
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    PendingAmountComponent,
    PendingCanComponent,
    AllOrdersComponent,
    MyCustomersComponent,
    AdvanceCommissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }


