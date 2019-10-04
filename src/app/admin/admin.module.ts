import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { PendingAmountComponent } from './pending-amount/pending-amount.component';
import { PendingCanComponent } from './pending-can/pending-can.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';

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
    ]
  },
];

@NgModule({
  declarations: [DashboardComponent, PendingAmountComponent, PendingCanComponent, AllOrdersComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }


