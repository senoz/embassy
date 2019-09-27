import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AuthGuardService } from './services/auth-guard.service';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { EditOrderComponent } from './edit-order/edit-order.component';

const routes: Routes = [

  { path: 'registration', component: RegistrationComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'myorders',
    component: MyOrdersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit-order/:id',
    component: EditOrderComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
