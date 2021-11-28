import { Component, Input, OnInit } from '@angular/core';
import {faShoppingBag, faCrown} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import { DomainService } from '../services/domain.service';
import {Product} from '../models/product'
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  providers: [DatePipe]
})
export class SingleProductComponent implements OnInit {

  bestseller:Product[] = [];
  myDate = new Date();

  faBag = faShoppingBag;
  faCrown = faCrown;

  selectedProduct;
  selectedProductSizes;
  quantity:number = 1;
  maxQuantity:number = 1;
  selectedSize:any;

  constructor(private http:HttpClient, private domain:DomainService, private date:DatePipe) { }

  @Input() products:any[];
  @Input() product:any;
  @Input() column:string;

  ngOnInit(): void {
    // this.http.get(this.domain.url+'api/goods/bestsellers/').subscribe((response:any)=>{
    //   this.bestseller = response;
    // })
  }


  AddToCart(product:number,sizes){
    this.selectedProductSizes = sizes;
    this.selectedProduct = product;
    $('#my_modal').css({'display':'block'})
  }

  AllDone(s,q){
    $('#my_modal').css({'display':'none'})
    var data = {
      product_id : this.selectedProduct,
      count:q,
      size_item_id:s
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
    $('#my_modal').css({'display':'none'})
  }

}
