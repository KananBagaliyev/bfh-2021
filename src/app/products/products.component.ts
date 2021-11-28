import { Component, OnInit } from '@angular/core';
import {faArrowLeft,faShoppingBag, faCrown, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { Options } from '@angular-slider/ngx-slider';
import * as $ from 'jquery'
import { ActivatedRoute, ActivationEnd,Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomainService } from '../services/domain.service';
import { PageService } from '../services/page.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { interval } from 'rxjs';
import {HttpCancelService} from '../services/http-cancel.service'
import { switchMap } from 'rxjs/operators';
import { LogoService } from '../services/logo.service';


@UntilDestroy()
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {


  faArrowLeft = faArrowLeft;
  faBag = faShoppingBag;
  faCrown = faCrown;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  myDate = new Date();

  category:string;
  type:string;
  class:string;
  category_name:string='';
  type_name='';
  pager:any = {};

  products:any[] = [];
  products_count:number =1;
  types:any[] =[];
  sizes:any[] = [];
  colors:any[] = [];
  brands:any[] = [];
  minPrice:number=0;
  maxPrice:number=200;
  selectedSize:any;
  quantity:number=1;
  maxQuantity:number=1;
  selectedProduct:number;
  premium:string = "Any";
  filter_status :boolean = false;
  filter_pagination_count:number = 0;

  filterSize=""
  filterColor = ""
  filterBrand = ""
  filterMin:number=0;
  filterMax:number=200;

  filterSizes:number[]=[];
  filterColors:string[]=[];
  filterBrands:string[]=[];
  selectedProductSizes:any[] = [];

  static_background:string = '';

  constructor(private logo:LogoService, private router:Router, private activatedRoute:ActivatedRoute, private http:HttpClient, private domain:DomainService, private pageService:PageService, private httpCancel:HttpCancelService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }
  options: Options = {
    floor: 0,
    ceil: 200
  };

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params =>{
      // location.reload();
      this.category = params.category;
      this.type = params.type;
      this.class = params.class;
      
      this.products = [];
      this.startLoading();

      this.getCatName();
      this.getTypeName();

      this.getProducts(0);
      this.getCount(0);
      this.getTypes();
      this.getSizes();
      this.getColors();
      this.getBrands();
      this.getPrices();

      this.getLogo();
      
    })

    

    

    // 
  }

  startLoading(){
    $('.loading_spinner').css({'display':'flex'})
    $('.product_section, #pagination').css({'display':'none'})
  }

  finishLoading(){
    $('.loading_spinner').css({'display':'none'})
    $('.product_section, #pagination').css({'display':'block'})
  }

  ToggleWidget(event){
    $(event.target).find('span').toggleClass('opened')
    $(event.target).next().slideToggle();
  }

  getProducts(page:number){
    this.products = []
    this.startLoading();
    this.http.get(this.domain.url+'api/products/'+this.category+'/'+this.type+'/'+this.class+'/?limit=18&offset='+page*18).subscribe((response:any)=>{
      this.products = response.results;
      (this.products)
      this.finishLoading()
      
      
    })
  }

  getCount(page:number){
    this.http.get(this.domain.url+'api/products/'+this.category+'/'+this.type+'/'+this.class+'/?limit=1&offset='+page).subscribe((response:any)=>{
      this.products_count = response.count;
      this.setPage(1)
    })
  }

  setCount(page:number){
    this.filter_pagination_count = page;
  }


  getTypes(){
    this.http.get(this.domain.url+'api/tip/?category='+this.category).subscribe((response:any)=>{
      
      this.types = response;
      // 
    })
  }


  getLogo(){
    this.logo.getLogos().subscribe((response:any)=>{
      this.static_background = response[0].product_background;
    })
  }

  hasProp(obj,field){
    return obj.findIndex(o=>o.slug == field)
  }

  filter(arr,category){
    // 
    return arr.filter(a=>a.category.findIndex(c=>c.slug==category)>-1)
  }

  getSizes(){
    this.http.get(this.domain.url+'api/sizes/?types='+this.type).subscribe((response:any)=>{
      
      this.sizes = response;
      
    })
  }

  getColors(){
    this.http.get(this.domain.url+'api/colors/?types='+this.type).subscribe((response:any)=>{
      
      this.colors = response;
      
    })
  }

  getBrands(){
    this.http.get(this.domain.url+'api/firms/?types='+this.type).subscribe((response:any)=>{
      
      this.brands = response;
      
    })
  }

  getPrices(){
    this.http.get(this.domain.url+'api/prices/'+this.category+'/'+this.type+'/'+this.class+'/').subscribe((response:any)=>{
     
      this.minPrice = Math.floor(response.min_price);
      this.maxPrice = Math.ceil(response.max_price);

      if(response.min_price==undefined || response.min_price==NaN){
        this.minPrice=0;
      }
      if(response.max_price==undefined || response.max_price==NaN){
        this.maxPrice=0;
      }

      let opts: Options = {
        floor: 0,
        ceil: this.maxPrice
      };

      this.options = opts;

      
    })
  }

  filterProducts(event?,name?,data?){

    this.startLoading()
    this.filter_status = true;

    if(event!=undefined){
      if(event.target.checked){
        if(name == "size"){
          this.filterSizes.push(data)
          this.filterSize = this.filterSizes.toString();
        }
        else if(name == "color"){
          this.filterColors.push(data)
          this.filterColor = this.filterColors.toString();
        }
        else if(name == "brand"){
          this.filterBrands.push(data)
          this.filterBrand = this.filterBrands.toString();
        }
        else if(name == "premium"){
          this.premium ="True"
          if(this.filter_status){
            this.setPage(1)
          }
        }
      }
  
      if(!event.target.checked){
        if(name == "size"){
          this.filterSizes.splice(this.filterSizes.indexOf(data),1)
          this.filterSize = this.filterSizes.toString();
        }
        else if(name == "color"){
          this.filterColors.splice(this.filterColors.indexOf(data),1)
          this.filterColor = this.filterColors.toString();
        }
        else if(name == "brand"){
          this.filterBrands.splice(this.filterBrands.indexOf(data),1)
          this.filterBrand = this.filterBrands.toString();
        }
        else if(name == "premium"){
          this.premium ="Any"
          if(this.filter_status){
            this.setPage(1)
          }
        }
      }
    }

    

    this.http.get(this.domain.url+'api/products/'+this.category+'/'+this.type+'/'+this.class+'/?min='+this.minPrice+'&&max='+this.maxPrice+'&&sizes='+this.filterSize+'&&color='+this.filterColor+'&&brand='+this.filterBrand+'&&isPremium='+this.premium+'&&limit=18&offset='+this.filter_pagination_count*18).subscribe((response:any)=>{
      
      this.products=response.results
      this.products_count=response.count;
      this.finishLoading();
      this.setPage(this.filter_pagination_count+1,false);
      

    })

  }

  clearFilter(){
    location.reload();
  }

  getCatName(){
    this.http.get(this.domain.url+'api/category-spesific/?slug='+this.category).subscribe((response:any)=>{
      
      this.category_name=response.name
      
    })
  }
  getTypeName(){
    this.http.get(this.domain.url+'api/type-spesific/?slug='+this.type).subscribe((response:any)=>{
      
      this.type_name=response.name
      
    })
  }

  setPage(page: number,condition:boolean=true) {
    // get pager object from service
    
    this.pager = this.pageService.getPager(this.products_count, page);

    

    
    if(!this.filter_status){
      this.getProducts(page-1)
    }

    if(condition){
      if(this.filter_status){
        this.filter_pagination_count = page-1;
        this.filterProducts();
      }
    }
    // get current page of items
  }












  // AddToCart(product:number,sizes){
  //   this.selectedProductSizes = sizes;
  //   this.selectedProduct = product;
  //   $('#my_modal').css({'display':'block'})
  // }

  // AllDone(s,q){
  //   $('#my_modal').css({'display':'none'})
  //   var data = {
  //     product_id : this.selectedProduct,
  //     count:q,
  //     sizeItem_id:s
  //   }
  //   this.http.post(this.domain.url+'cart/cart/add/'+this.selectedProduct+'/'+q+'/'+s+'/',data).subscribe((response:any)=>{
  //     
  //   })
  //   // 
  // }

  // Decrease(quantity:number){
  //   if(quantity!=1){
      
  //     this.quantity = Number(quantity)-1
  //   }
  // }

  // Increase(quantity:number){
  //   if(quantity!=this.maxQuantity){
      
  //     this.quantity = Number(quantity)+1
  //   }
  // }

  // getSize(arr){
  //   this.maxQuantity = arr[arr.length-1]
  //   
  //   $('.counter button').removeAttr('disabled');
  // }



}
