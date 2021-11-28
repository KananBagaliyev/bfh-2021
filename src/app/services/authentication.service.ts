import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainService } from './domain.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private domain:DomainService, private http:HttpClient) { }


  registerUser(name:string,surname:string,email:string,telephone:string,pass:string,confirm_pass:string){

    var data = {
      email:email,
      first_name:name,
      last_name:surname,
      password1:pass,
      password2:confirm_pass,
      phone:telephone
    }

    

    return this.http.post(this.domain.url+'api/rest-auth/registration/',data,{headers:new HttpHeaders({'Accept-Language':'az-Latn'})})

  }

  loginUser(email:string,pass:string){

    var data = {
      email:email,
      password:pass,
    }


    return this.http.post(this.domain.url+'api/rest-auth/login/',data,{headers:new HttpHeaders({'Accept-Language':'az-Latn'})})

  }

  getUser(){
    return this.http.get(this.domain.url+'api/rest-auth/user/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})})
  }

  logOut(){
    return this.http.post(this.domain.url+'api/rest-auth/logout/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})})
  }
}
