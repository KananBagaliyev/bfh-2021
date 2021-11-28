import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';
import {faCheck, faSpinner} from '@fortawesome/free-solid-svg-icons'
import * as $ from 'jquery'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.scss'],
  providers: [DatePipe]
})
export class SellerProductsComponent implements OnInit {

  faCheck = faCheck;
  faSpinner = faSpinner;

  products:any[] = [];
  myDate = new Date();

  count:number = 0;
  length:number = 0;
  state:string = 'All';

  constructor(private http:HttpClient, private domain:DomainService, private auth:AuthenticationService) { }

  ngOnInit(): void {

    this.getProducts(0);
  }


  
  getProducts(count:number,approve_state?:string,event?){
    
    
    
    $('.loading_spinner').css({'display':'flex'})
    $('.table_content').css({'display':'none'})
    if(event!=undefined){
      $('.table_navigation').find('.active').removeClass('active')
      $(event.currentTarget).addClass('active')
      this.products = [];
      this.count=1;
      this.state = approve_state
    }
    else if(event === undefined){
      this.count++;
    }
    
    if(approve_state==='All' || approve_state===undefined){
      this.auth.getUser().subscribe((response:any)=>{
        
    
        this.http.get(this.domain.url+'api/users/'+response.pk+'/my-products/?limit=25&offset='+count*25,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((res:any)=>{
          res.results.forEach(element => {
            this.products.push(element);
          });
          this.length = res.count;
          $('.loading_spinner').css({'display':'none'})
          $('.table_content').css({'display':'block'})
          
        })
      })
    }

    else if(approve_state!='All' && approve_state!=undefined){
      this.state = approve_state;
      // 
      this.auth.getUser().subscribe((response:any)=>{
        
        this.http.get(this.domain.url+'api/users/'+response.pk+'/my-products/?approved='+approve_state+'&limit=25&offset='+count*25,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((res:any)=>{
          res.results.forEach(element => {
            this.products.push(element);
          });
          this.length = res.count;
          
          $('.loading_spinner').css({'display':'none'})
          $('.table_content').css({'display':'block'})
        })
      })
    }
    
  }

}
