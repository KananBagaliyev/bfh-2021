import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {faChevronRight, faTimes} from '@fortawesome/free-solid-svg-icons'
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';
import * as mapboxgl from 'mapbox-gl';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  clickEventSubscription:Subscription

  faChevronRight = faChevronRight;

  current_user:any = {};
  longitude:number = 49.8671;
  latitude:number= 40.4093;
  map:any;
  marker:any;
  seller_state:boolean = false;
  cart_products:any[] = [];
  cart:any = {};

  constructor(private http:HttpClient, private domain:DomainService,private shared:SharedService, private auth:AuthenticationService, private toastr:ToastrService) {
    this.clickEventSubscription = shared.getCartEvent().subscribe(()=>{
      this.getCartItems();
    })
   }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken:'pk.eyJ1IjoiYmdseXZ2IiwiYSI6ImNraHJoMTA1NTEzN2YzMHA1Mjdxa2N4cjYifQ.JbE14lnRaO5sIIDaGBlvNg',
      container: 'map1', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [this.longitude,this.latitude], // starting position [lng, lat]
      zoom: 10 // starting zoom
    });

    
    this.marker = new mapboxgl.Marker().setLngLat(this.map.getCenter()).addTo(this.map);


    this.marker.setLngLat(this.map.getCenter());

    this.getCurrentUser();

    this.getCartItems();
  }

  getCurrentUser(){
    this.auth.getUser().subscribe((response:any)=>{
      this.seller_state = response.seller;
      this.http.get(this.domain.url+'api/users/'+response.pk+'/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe(res=>{
        this.current_user = res;
        
        if(this.current_user.address!=""){
          this.map.flyTo({center:this.current_user.address.split(',')})
          this.marker.setLngLat(this.current_user.address.split(','))
        }

      })
    })
    
  }

  getCartItems(){
    this.http.get(this.domain.url+'cart/get/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
      this.cart_products = response.cart_item;
      this.cart = response;
      
    })
  }

  ConfirmPayment(){
    this.http.get(this.domain.url+'cart/get/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((res:any)=>{

      var data = {
        id:res.id
      }
      
      this.http.post(this.domain.url+'orders/odenis-tamamla/',data,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
        
        if(response.url!=undefined){
          window.location.href = response.url;
        }
        else{
          this.toastr.error(response,'Xəta')
        }
        
      })
      
    })
    
  }

}
