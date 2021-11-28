import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { DomainService } from './domain.service';
import {Brand}from '../models/brand'
import {Category}from '../models/category'
import {Class}from '../models/class'
import {Size}from '../models/size'
import {Type}from '../models/type'

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http:HttpClient, private domain:DomainService) { }

  Categories(){
    return this.http.get<Category[]>(this.domain.url+'api/categories')
  }

  Types(){
    return this.http.get<Type[]>(this.domain.url+'api/types')
  }

  Classes(){
    return this.http.get<Class[]>(this.domain.url+'api/classes')
  }

  Brands(){
    return this.http.get<Brand[]>(this.domain.url+'api/firms')
  }

  Sizes(){
    return this.http.get<Size[]>(this.domain.url+'api/sizes')
  }

  RemoveCartItem(id:number){
    var data={
      cart_item_id:id
    }
    
    return this.http.post(this.domain.url+'cart/remove/',data,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})});
  }
}
