import { BrowserModule } from '@angular/platform-browser';
import { forwardRef,NgModule } from '@angular/core';
import {Route,RouterModule, Routes} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductComponent } from './product/product.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ProductsComponent } from './products/products.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RegisterComponent } from './register/register.component';
import { BasketComponent } from './basket/basket.component';
import { FooterComponent } from './footer/footer.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { NewProductComponent } from './new-product/new-product.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OrderComponent } from './order/order.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';
import {FormsModule} from '@angular/forms'
import { ImageCropperModule } from 'ngx-image-cropper';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import { SingleProductComponent } from './single-product/single-product.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AccountComponent } from './account/account.component';
import { VerticalNavbarComponent } from './vertical-navbar/vertical-navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerticalNavbarDashboardComponent } from './vertical-navbar-dashboard/vertical-navbar-dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { SellerProductsComponent } from './seller-products/seller-products.component';
import { MyordersComponent } from './myorders/myorders.component';
import { SellerInformationComponent } from './seller-information/seller-information.component';
import { UserInformationComponent } from './user-information/user-information.component';
import { InterceptorService } from './services/interceptor.service';
import { AboutUsComponent } from './about-us/about-us.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AuthGuard } from './guard/auth.guard';
import { SimpleAuthGuard } from './guard/simple-auth.guard';
import { BasicAuthGuard } from './guard/basic-auth.guard';
import { AuthNotSellerGuard } from './guard/auth-not-seller.guard';
import { SearchComponent } from './search/search.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { OrdersToMeComponent } from './orders-to-me/orders-to-me.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { HttpCancelService } from './services/http-cancel.service';
import { ManageHttpInterceptor } from './interceptor/managehttp.interceptor';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { PaymentRejectComponent } from './payment-reject/payment-reject.component';


const routes:Routes=[
  {path:"",component:HomeComponent},
  {path:"anasehife",component:HomeComponent},
  {path:"mehsul/:product",component:ProductComponent},
  {path:"mehsullar/:category/:type/:class",component:ProductsComponent},
  {path:"hesab/qeydiyyat",component:RegisterComponent,canActivate:[SimpleAuthGuard]},
  {path:"footer",component:FooterComponent},
  {path:"sebet",component:BasketComponent,canActivate:[BasicAuthGuard]},
  {path:"idareetme-paneli/yeni-mehsul",component:NewProductComponent,canActivate:[AuthGuard]},
  {path:"sifaris",component:OrderComponent,canActivate:[BasicAuthGuard]},
  {path:"loading",component:LoadingComponent},
  {path:"hesab",component:UserInformationComponent,canActivate:[AuthNotSellerGuard]},
  {path:"idareetme-paneli",component:DashboardComponent,canActivate:[AuthGuard]},
  {path:"idareetme-paneli/mehsullar",component:SellerProductsComponent,canActivate:[AuthGuard]},
  {path:"idareetme-paneli/satici-melumati",component:SellerInformationComponent,canActivate:[AuthGuard]},
  {path:"hesab/menim-sifarislerim",component:MyordersComponent,canActivate:[AuthNotSellerGuard]},
  {path:"idareetme-paneli/sifarislerim",component:OrdersToMeComponent,canActivate:[AuthGuard]},
  {path:"biz-kimik",component:AboutUsComponent},
  {path:"odenis-catdirilma",component:ShippingInfoComponent},
  {path:"sifreni-unutmusam",component:ForgetPasswordComponent},
  {path:"sifreni-yenile/:uid/:token",component:ResetPasswordComponent},
  {path:"axtaris/:keyword",component:SearchComponent},
  {path:"emaili-tesdiqle/:token",component:EmailConfirmationComponent},
  {path:"sifaris-detallari/:id",component:OrderDetailsComponent},
  {path:"odenis-tesdiqi",component:PaymentConfirmationComponent},
  {path:"odenis-xetasi",component:PaymentRejectComponent},
  {path:"404",component:ErrorComponent},
  {path:"**",pathMatch: 'full', redirectTo: '404'},
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ProductComponent,
    ProductsComponent,
    RegisterComponent,
    BasketComponent,
    FooterComponent,
    NewProductComponent,
    OrderComponent,
    ErrorComponent,
    LoadingComponent,
    SingleProductComponent,
    AccountComponent,
    VerticalNavbarComponent,
    DashboardComponent,
    VerticalNavbarDashboardComponent,
    SellerProductsComponent,
    MyordersComponent,
    SellerInformationComponent,
    UserInformationComponent,
    AboutUsComponent,
    ShippingInfoComponent,
    ForgetPasswordComponent,
    SearchComponent,
    ResetPasswordComponent,
    EmailConfirmationComponent,
    OrdersToMeComponent,
    OrderDetailsComponent,
    PaymentConfirmationComponent,
    PaymentRejectComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FontAwesomeModule,
    CarouselModule ,
    BrowserAnimationsModule,
    MatSelectModule,
    SlickCarouselModule,
    MatInputModule,
    MatFormFieldModule,
    NgxSliderModule,
    NgxImageZoomModule,
    CKEditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ImageCropperModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
    ChartsModule,
    NgbModule
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NewProductComponent),
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
