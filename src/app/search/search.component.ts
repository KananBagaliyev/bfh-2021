import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainService } from '../services/domain.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  keyword:string = '';
  products:any = [];
  count:number = 0;
  length:number = 0;

  constructor(private http:HttpClient, private activatedRoute:ActivatedRoute, private domain:DomainService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params =>{
      this.startLoading();
      this.keyword = params.keyword
      this.products = [];
      this.getResult(this.keyword)
      
    })
  }


  startLoading(){
    $('.loading_spinner').css({'display':'flex'})
    $('.search_products, #search_pagination').css({'display':'none'})
  }

  finishLoading(){
    $('.loading_spinner').css({'display':'none'})
    $('.search_products, #search_pagination').css({'display':'block'})
  }

  getResult(keyword,count:number = 0){
    this.count++;
    this.startLoading;
    
    this.http.get(this.domain.url+'api/products/?search='+keyword+'&limit=18&offset='+count*18).subscribe((response:any)=>{
      response.results.forEach(element => {
        this.products.push(element);
      });
      
      this.finishLoading();
      this.length = response.count;
    })
  }

}
