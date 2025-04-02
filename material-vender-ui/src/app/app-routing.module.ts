import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorListComponent } from './components/vendor/vendor-list/vendor-list.component';
import { VendorCreateComponent } from './components/vendor/vendor-create/vendor-create.component';
import { VendorUpdateComponent } from './components/vendor/vendor-update/vendor-update.component';
import { MaterialListComponent } from './components/material/material-list/material-list.component';
import { MaterialCreateComponent } from './components/material/material-create/material-create.component';
import { MaterialUpdateComponent } from './components/material/material-update/material-update.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { OrderCreateComponent } from './components/order/order-create/order-create.component';
import { OrderUpdateComponent } from './components/order/order-update/order-update.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Dashboard routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'materials', pathMatch: 'full' },
      { path: 'materials', component: MaterialListComponent },
      { path: 'materials/create', component: MaterialCreateComponent },
      { path: 'materials/update/:id', component: MaterialUpdateComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/create', component: OrderCreateComponent },
      { path: 'orders/update/:id', component: OrderUpdateComponent },
      { path: 'orders/:id', component: OrderDetailsComponent },
      { path: 'vendors', component: VendorListComponent },
      { path: 'vendors/create', component: VendorCreateComponent },
      { path: 'vendors/update/:id', component: VendorUpdateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
