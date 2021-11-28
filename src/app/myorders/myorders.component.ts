import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';
import {faLink} from '@fortawesome/free-solid-svg-icons'
import * as $ from 'jquery'

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyordersComponent implements OnInit {

  faLink = faLink;

  current_user:any = {};
  my_orders:any = [];

  count:number = 0;
  length:number = 0;

  constructor(private http:HttpClient, private domain:DomainService, private auth:AuthenticationService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getMyOrders(0);
  }


  getCurrentUser(){
    this.auth.getUser().subscribe((response:any)=>{
      this.http.get(this.domain.url+'api/users/'+response.pk+'/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe(res=>{
        this.current_user = res;
        // 

      })
    })
    
  }

  getMyOrders(count){
    this.count++;
    this.showLoading();

    this.auth.getUser().subscribe((response:any)=>{
      this.http.get(this.domain.url+'api/users/'+response.pk+'/my-orders/?limit=25&offset='+count*25,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((res:any)=>{
        res.results.forEach(element => {
          this.my_orders.push(element)
        });
        this.length = res.count;
        this.hideLoading();
        
        

      })
    })
  }

  showLoading(){
    $('.loading_spinner').css({'display':'flex'})
    $('.main_row').css({'display':'none'})
    $('.product_pagination').css({'display':'none'})
  }

  hideLoading(){
    $('.loading_spinner').css({'display':'none'})
    $('.main_row').css({'display':'flex'})
    $('.product_pagination').css({'display':'flex'})
  }

}
