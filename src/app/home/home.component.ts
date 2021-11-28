import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {faShoppingBag, faCrown} from '@fortawesome/free-solid-svg-icons';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as $ from 'jquery';
import { DomainService } from '../services/domain.service';
import { dom } from '@fortawesome/fontawesome-svg-core';
import {Banner} from '../models/banner'
import {Product} from '../models/product'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {

  faBag = faShoppingBag;
  faCrown = faCrown;

  myDate = new Date();

  selectedProductSizes:any[] = [];
  selectedProduct:any;
  quantity:number = 1;
  maxQuantity:number = 1;
  selectedSize:any;

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<img src="assets/img/chevrons/left.svg" alt="previous arrow">', '<img src="assets/img/chevrons/right.svg" alt="next arrow">'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  imageSlider = {
    speed:300,
    slidesToShow:1,
    slidesToScroll:1,
    cssEase:'linear',
    autoplaySpeed:5000,
    fade:true,
    autoplay: false,
    draggable:true,
    dots:true,
    prevArrow:'.client-feedback .prev-arrow',
    nextArrow:'.client-feedback .next-arrow',
  };
  premiumSlider = {
    speed:300,
    slidesToShow:4,
    slidesToScroll:4,
    cssEase:'linear',
    autoplaySpeed:5000,
    fade:true,
    autoplay: false,
    draggable:true,
    dots:true,
    prevArrow:'.client-feedback .prev-arrow',
    nextArrow:'.client-feedback .next-arrow',
  };

  banners:Banner[] = [];
  premium_products:Product[] = []
  bestseller:Product[] = []

  constructor(private http:HttpClient, private domain:DomainService, private date: DatePipe) {
   }

  ngOnInit(): void {

    this.animation()

    this.getBanner();

    this.getPremium();

    this.getBestseller();
    

  }

  getBanner(){
    this.http.get<Banner[]>(this.domain.url+'api/banner/').subscribe((response:Banner[])=>{
      this.banners = response;
    })
  }

  getPremium(){
    $('.premium_template').css({'display':'none'})
    $('.loading_spinner').css({'display':'flex'})
    this.http.get(this.domain.url+'api/products/?isPremium=True').subscribe((response:any)=>{
      $('.premium_template').css({'display':'block'})
      $('.loading_spinner').css({'display':'none'})
      this.premium_products = response.results.slice(0,12);
    })
  }


  getBestseller(){
    $('.bestseller_template').css({'display':'none'})
    $('.loading_spinner').css({'display':'flex'})
    this.http.get(this.domain.url+'api/goods/bestsellers/').subscribe((response:any)=>{
      this.bestseller = response.slice(0,20);
      $('.bestseller_template').css({'display':'block'})
      $('.loading_spinner').css({'display':'none'})
    })
  }

  afterChange(){
   this.animation()
  }

  breakpoint(){
    this.animation();
  }

  beforeChange(){
    this.animation();
  }


  animation():void{
    $('.title').removeClass('active_title')
    $('.option').removeClass('active_option')
    $('.description').removeClass('active_description')
    $('.button').removeClass('active_button')

    setTimeout(() => {
      
      $('.slick-active').find('.title').addClass('active_title')

      setTimeout(() => {
      
        $('.slick-active').find('.option').addClass('active_option')

        setTimeout(() => {
          
          $('.slick-active').find('.description').addClass('active_description')
          $('.slick-active').find('.button').addClass('active_button')
    
        }, 500);
  
      }, 500);
      

    }, 500);
  }

  AddToCart(product:number,sizes){
    
    this.selectedProductSizes = sizes;
    this.selectedProduct = product;
    
    $('.my_modal2').css({'display':'block'})
  }
  
  AllDone(s,q){
    $('.my_modal2').css({'display':'none'})
    var data = {
      product_id : this.selectedProduct,
      count:q,
      sizeItem_id:s
    }
    this.http.post(this.domain.url+'cart/cart/add/',data).subscribe((response:any)=>{
      
    })
    // 
  }

  Decrease(quantity:number){
    if(quantity!=1){
      
      this.quantity = Number(quantity)-1
    }
  }

  Increase(quantity:number){
    if(quantity!=this.maxQuantity){
      
      this.quantity = Number(quantity)+1
    }
  }

  getSize(arr){
    this.maxQuantity = arr[arr.length-1]
    
    $('.counter button').removeAttr('disabled');
  }

  Close(){
    $('.my_modal2').css({'display':'none'})
  }

}
