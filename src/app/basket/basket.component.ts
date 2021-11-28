import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {faChevronRight, faTimes} from '@fortawesome/free-solid-svg-icons'
import { DomainService } from '../services/domain.service';
import { SharedService } from '../services/shared.service';
import {Subscription} from 'rxjs'
import { ApiCallService } from '../services/api-call.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  clickEventSubscription:Subscription

  faChevronRight = faChevronRight;
  faTimes = faTimes;
  quantity:number = 1;

  cart_products:any[] = [];
  cart:any = '';

  constructor(private http:HttpClient, private domain:DomainService,private shared:SharedService, private ApiCall:ApiCallService, private toastr:ToastrService) {
    this.clickEventSubscription = shared.getCartEvent().subscribe(()=>{
      this.getCartItems();
    })
   }

  ngOnInit(): void {

    this.getCartItems();
  }

  Decrease(quantity:number){
    if(quantity!=1){
      
      this.quantity = Number(quantity)-1
    }
  }

  Increase(quantity:number){
    if(quantity!=100000){
      
      this.quantity = Number(quantity)+1
    }
  }

  getCartItems(){
    this.http.get(this.domain.url+'cart/get/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
      this.cart_products = response.cart_item;
      this.cart = response;
      
    })
  }

  removeCartItem(id){
    this.ApiCall.RemoveCartItem(id).subscribe(response=>{
      this.getCartItems()
      this.shared.sendCartEvent();
    })
  }

  ApplyCoupon(data){
    this.http.post(this.domain.url+'coupons/apply/',data,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
      
      this.getCartItems();
      if(response == "No such coupon exists"){
        
        this.toastr.error('Belə promokod tapılmadı.','Promokod')
      }
      else if(response == "You have alredy used this coupon!"){
        
        this.toastr.warning('Bu promokodu istifadə etmisininz.','Promokod')
      }
      else{
        
        this.toastr.success('Sizin promokod müvəffəqiyyətlə istifadə olundu.','Promokod')
      }
    })
    
  }

}
