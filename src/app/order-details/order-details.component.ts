import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {


  order:any = {};

  constructor(private activatedRoute:ActivatedRoute, private http:HttpClient, private domain:DomainService, private auth:AuthenticationService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params =>{
      this.getOrder(params.id)
      
      
    })

  }


  getOrder(id){
    this.http.get(this.domain.url+'api/orderlist/'+id,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
      this.order = response;
      
      
    })
  }

}
