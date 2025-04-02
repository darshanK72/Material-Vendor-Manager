import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialListComponent } from './components/material/material-list/material-list.component';
import { MaterialCreateComponent } from './components/material/material-create/material-create.component';
import { MaterialUpdateComponent } from './components/material/material-update/material-update.component';
import { OrderCreateComponent } from './components/order/order-create/order-create.component';
import { VendorListComponent } from './components/vendor/vendor-list/vendor-list.component';
import { VendorUpdateComponent } from './components/vendor/vendor-update/vendor-update.component';
import { OrderUpdateComponent } from './components/order/order-update/order-update.component';
import { OrderDetailsComponent } from './components/order/order-details/order-details.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VendorCreateComponent } from './components/vendor/vendor-create/vendor-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MaterialListComponent,
    MaterialCreateComponent,
    MaterialUpdateComponent,
    OrderListComponent,
    OrderUpdateComponent,
    OrderDetailsComponent,
    OrderCreateComponent,
    VendorListComponent,
    VendorUpdateComponent,
    VendorCreateComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
