import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {faFacebookF,faTwitter,faInstagram,faAndroid,faAppStoreIos} from '@fortawesome/free-brands-svg-icons';
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';
import { LogoService } from '../services/logo.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  faFacebook=faFacebookF;
  faTwitter = faTwitter;
  faInstagram = faInstagram;
  faAndroid = faAndroid;
  faAppStoreIos = faAppStoreIos;

  login_status:boolean = false;
  user:any = {};

  contact = {
    Facebook:'',
    Instagram:'',
    Twitter:'',
    Android:'',
    Ios:'',
    Email:'',
    Phone:'',
    Address:'',
  };

  footer_logo = '';

  constructor(private logo:LogoService, private auth:AuthenticationService, private domain:DomainService, private http:HttpClient) { }

  ngOnInit(): void {
    this.getUser();
    // this.getContactInfo();
    this.getLogo();
  }

  getUser(){
    if(localStorage.getItem('user')){
      this.auth.getUser().subscribe((response:any)=>{
        this.user = response
        
      });
      this.login_status=true;

    }
  }

  getLogo(){
    this.logo.getLogos().subscribe((response:any)=>{
      this.footer_logo = response[0].footer_logo;
    })
  }

  // getContactInfo(){
  //   this.http.get(this.domain.url+'api/contact/').subscribe((response:any)=>{
      
  //     this.contact.Facebook = response.filter(function(el) {
  //       return el.name=== 'Facebook';
  //     })[0].link;
  //     this.contact.Instagram = response.filter(function(el) {
  //       return el.name=== 'Instagram';
  //     })[0].link;
  //     this.contact.Twitter = response.filter(function(el) {
  //       return el.name=== 'Twitter';
  //     })[0].link;
  //     this.contact.Android = response.filter(function(el) {
  //       return el.name=== 'Android';
  //     })[0].link;
  //     this.contact.Ios = response.filter(function(el) {
  //       return el.name=== 'IOS';
  //     })[0].link;
  //     this.contact.Address = response.filter(function(el) {
  //       return el.name=== 'Ünvan';
  //     })[0].link;
  //     this.contact.Phone = response.filter(function(el) {
  //       return el.name=== 'Nömrə';
  //     })[0].link;
  //     this.contact.Email = response.filter(function(el) {
  //       return el.name=== 'Email';
  //     })[0].link;

  //   })
  // }

}
