import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {faShoppingBag, faCrown} from '@fortawesome/free-solid-svg-icons';

import * as $ from 'jquery'
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [DatePipe]
})
export class ProductComponent implements OnInit {

  faBag = faShoppingBag;
  faCrown = faCrown;

  myDate = new Date();
  
  size:number = 0;
  quantity:number = 1;
  max_quantity:number=1;

  selected = 0;
  hovered = 0;
  readonly = false;
  user_pk = 0;

  map_Array = [];

  user_status = false;
  product_id = 0;

  producer  = "";
  reviews = [];

  product:any;

  imagesSlider = {
    speed:300,
    slidesToShow:1,
    slidesToScroll:1,
    cssEase:'linear',
    fade:true,
    autoplay: false,
    draggable:true,
    prevArrow:'.client-feedback .prev-arrow',
    nextArrow:'.client-feedback .next-arrow',
    asNavFor:".thumbs",
    pauseOnHover:true
  };
  thumbnailsSlider = {
    speed:300,
    slidesToShow:4,
    slidesToScroll:1,
    vertical:true,
    cssEase:'linear',
    autoplay: true,
    centerMode:false,
    draggable:false,
    focusOnSelect:true,
    asNavFor:".feedback",
    prevArrow:'.client-thumbnails .prev-arrow',
    nextArrow:'.client-thumbnails .next-arrow',
    pauseOnHover:true,
    responsive: [{
      breakpoint: 992,
      settings: {
          slidesToShow: 4,
          vertical:false
      }
  
  }]
  };

  constructor(private activatedRoute:ActivatedRoute, private shared:SharedService, private http:HttpClient, private domain:DomainService, private toastr:ToastrService, private auth:AuthenticationService) {}

  ngOnInit(): void {

    this.getUserStatus();
    this.getUserName();
    this.generateVerifiedMap(4,5)

    this.activatedRoute.params.subscribe(params =>{
      this.getProduct(params.product);
      
      
    })

  }

  generateVerifiedMap(row:number,column:number){
    var r=0;
    var c = 0;
    var column_Arr = [];
    var row_Arr = [];
    while(r<row){
      while(c < column){
        var data = {
          moisture:Math.floor(Math.random() * 100)/100
        }
        column_Arr.push(data);
        c++;
        console.log(data)
      }
      c = 0;
      r++;
      row_Arr.push(column_Arr);
      column_Arr = [];
    }
    this.map_Array = row_Arr;
    console.log(this.map_Array)
    
  }

  getColorCode(moisture:number){
    var color=""
    // console.log(moisture)
    if(moisture>0.5){
      color = "rgba(0,0,255,"+moisture+")";
    }
    else if(moisture<=0.5){
      color = "rgba(255,0,0,"+moisture+")";
    }
    // console.log(color)
    return color;
      
  }

  getProduct(slug){
    this.http.get(this.domain.url+'api/goods/'+slug+'/').subscribe((response:any)=>{
      this.product_id = response.id
      this.product = response;
      this.http.get(this.domain.url+'api/users/').subscribe((r:any)=>{
        r.forEach(el => {
          if(el.id==response.author){
            this.producer = el.first_name+" "+el.last_name
          }
        });
      })
      this.adjustAmount(response.sizes[0].quantity);
      this.size = response.sizes[0].id;
      console.log(response)
      this.getReviews(this.product_id)
      
    })
  }

  UpdateAmount(quantity){
    console.log(quantity)
    console.log(this.max_quantity)
    if(quantity>this.max_quantity){
      this.quantity = this.max_quantity
    }
  }

  Decrease(quantity:number){
    if(quantity!=1){
      
      this.quantity = Number(quantity)-1
    }
  }

  Increase(quantity:number){
    if(quantity!=this.max_quantity){
      
      this.quantity = Number(quantity)+1
    }
  }

  getUserStatus(){
    if(localStorage.getItem('user')){
      this.user_status = true;
      console.log(this.user_status)
    }
  }

  adjustAmount(max_quantity){
    this.max_quantity = max_quantity;
    if (max_quantity<this.quantity){
      this.quantity = max_quantity
    }
  }

  // getProperSize(size_item_id:number, max_quantity:number,event){

  //   this.max_quantity = max_quantity;
  //   if (max_quantity<this.quantity){
  //     this.quantity = max_quantity
  //   }

  //   this.size = size_item_id;
  //   $('.size').find('.active').removeClass('active');
  //   $(event.currentTarget).addClass('active');
  //   // $('button').removeAttr('disabled')
  //   // var data = {
  //   //   product_id : this.selectedProduct,
  //   //   count:q,
  //   //   size_item_id:s
  //   // }

  // }

  AddToCart(id,quantity){
    var data = {
      product_id:id,
      count:quantity,
      size_item_id:this.size
    }
    console.log(this.size)
    console.log(data)

    if(localStorage.getItem('user')){
      this.http.post(this.domain.url+'cart/add/',data,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe(response=>{
        this.shared.sendCartEvent();
        this.toastr.success('Məhsul səbətə əlavə olundu','Səbət')
      })
    }
    else{
      this.toastr.error('Zəhmət olmasa hesabınıza daxil olun','Səbət')
    }
    
  }

  OnSubmitReview(reviewText){
    this.auth.getUser().subscribe((response:any)=>{
      this.user_pk = response.pk;
      console.log(response)
      console.log(reviewText)
      console.log(this.selected)
      console.log(this.user_pk)
      console.log(this.product_id)
      var data = {
        user_id: this.user_pk,
        product_id:this.product_id,
        author_name:response.first_name+" "+ response.last_name,
        review_text:reviewText,
        review_point:this.selected.toString()

      }
      console.log(data)
      this.http.post(this.domain.url+'api/reviewListPost/',data).subscribe(r=>{
        
        this.getReviews(this.product_id)
        reviewText = "";
      })
    })

    
  }

  getReviews(id:number){

    this.http.get(this.domain.url+'api/reviewList/'+id).subscribe((response:any)=>{
      this.reviews = response.reverse();
      console.log(response)
    })

  }


  getUserName(){
    this.auth.getUser().subscribe((response:any)=>{
      return response.first_name+' '+response.last_name
    })

  }


}
