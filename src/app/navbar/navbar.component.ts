import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {faSearch,faShoppingBasket,faShoppingBag, faTimes, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import * as $ from 'jquery'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DomainService } from '../services/domain.service';
import { AuthenticationService } from '../services/authentication.service';
import { SharedService } from '../services/shared.service';
import {Subscription} from 'rxjs'
import { ApiCallService } from '../services/api-call.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LogoService } from '../services/logo.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  
  @ViewChild('box', { static: false }) box: ElementRef;

  clickEventSubscription:Subscription

  faSearch = faSearch;
  faUser = faUser;
  faBasket = faShoppingBasket;
  faShoppingBag = faShoppingBag;
  faTimes = faTimes;
  faChevronDown = faChevronDown;


  trigger_nav:boolean = false;
  mouse_position:boolean = false;

  cart_products:any[] = [];
  cart:any = {};

  categories:any[]=[]
  types:any[]=[]
  result:any[]=[]
  category_id:number;
  route:string = '';
  navbar_logo:string = ''

  user:any;

  login_status:boolean = false;

  constructor(private logo:LogoService, private router:Router,private http:HttpClient, private domain:DomainService, private auth:AuthenticationService,private shared:SharedService, private ApiCall:ApiCallService) {
    this.clickEventSubscription = shared.getCartEvent().subscribe(()=>{
      this.CartDetail();
    })
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((res:any) => {
      this.route = res.url.substring(1);
      
    });
   }

  ngOnInit(): void {
    this.getCategory();
    this.getUser();
    this.CartDetail();
    this.getLogo();

  }

  OpenNav(){
    
    $('.navbar_wrapper').css({'display':'block'})
    $('.wrapper_container').animate({marginLeft:'0px'},500)
    $('.close_mobile_navbar').animate({marginTop:'0px'},500)
    // $('body').css({'overflowY':'hidden'})
  }

  CloseNav(){
    $('.wrapper_container').animate({marginLeft:'-1000px'},500)
    $('.close_mobile_navbar').animate({marginTop:'-1000px'},500)
    setTimeout(()=>{
      $('.navbar_wrapper').css({'display':'none'})
    },300)
    // $('body').css({'overflowY':'auto'})
  }

  getCategory(){
    this.http.get(this.domain.url+'api/categories/').subscribe((response:any)=>{
      // 
      this.result = response
      this.categories = response
      this.types = response.types
      
    })
    
    
  }

  getLogo(){
    this.logo.getLogos().subscribe((response:any)=>{
      this.navbar_logo = response[0].navbar_logo;
    })
  }

  OpenDropdown(slug,id){
    this.category_id = id
    // 
    var object = this.result[this.result.findIndex(r=>r.slug == slug)]
    this.types = object.types
    // $('.sub_nav').css({'display':'flex'})

    // 
    // 
  }

  CloseDropdown(){
    $('.sub_nav').css({'display':'none'})
  }

  openNav(k){
    // 
    
    if(!this.trigger_nav){
      $('.dropdownx_'+k).find('.sub_nav').slideDown().css({'display':'flex'})
    }
    // 
  }

  closeNav(k){
    
    
    if(this.trigger_nav || this.mouse_position==false){
      $('.dropdownx_'+k).find('.sub_nav').slideUp().css({'display':'flex'})
    }
  }

  // closeNav(k){
  //   $('.dropdownx_'+k).find('.sub_nav').slideUp().css({'display':'flex'})
  // }

  triggerNav(state,mouse,k){
    this.trigger_nav = state;
    this.mouse_position = mouse;
    if(state==false && mouse ==true){
      $('.dropdownx_'+k).find('.sub_nav').slideUp().css({'display':'flex'})
      this.mouse_position = false;
    }
  }

  CartDetail(){
    if(localStorage.getItem('user')!=null){
      this.http.get(this.domain.url+'cart/get/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
        if(response!="Empty Cart"){
          this.cart_products = response.cart_item;
          this.cart = response;
    
          
        }

        
      })
    }
  }

  SearchRedirect(data){
    this.router.navigateByUrl('/axtaris/'+data);
  }

  getUser(){
    if(localStorage.getItem('user')){
      this.auth.getUser().subscribe((response:any)=>{
        this.user = response
        
        this.login_status=true;
      },(err:HttpErrorResponse)=>{
        localStorage.removeItem('user')
      });

    }
    
  }

  removeCartItem(id){
    this.ApiCall.RemoveCartItem(id).subscribe(response=>{
      this.CartDetail();
      this.shared.sendCartEvent();
    })
  }

  mobileTypeAnimation(event){
      $(event.currentTarget).next().children().first().stop(true,true).slideToggle()
      if($(event.currentTarget).children().last()[0].nodeName.toLowerCase()!="p"){
        $(event.currentTarget).children().last().toggleClass('rotation')
      }
      
  }

  mobileClassAnimation(event){
    $(event.currentTarget).siblings().stop(true,true).slideToggle()
    if($(event.currentTarget).children().last()[0].nodeName.toLowerCase()!="h5"){
      $(event.currentTarget).children().last().toggleClass('rotation')
    }
    
  }

  BodyOverflow(){
    $('body').css({'overflowY':'auto'})
  }


}
