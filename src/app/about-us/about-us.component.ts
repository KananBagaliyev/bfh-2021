import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomainService } from '../services/domain.service';
import { LogoService } from '../services/logo.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  data:string = '';
  about_background:string = '';

  constructor(private logo:LogoService, private http:HttpClient, private domain:DomainService) { }

  ngOnInit(): void {

    this.getData();
    this.getLogo();

  }

  getData(){
    this.http.get(this.domain.url+'api/who-we-are-shipping/').subscribe((response:any)=>{
      this.data = response[0].who_we_are;
    })
  }

  getLogo(){
    this.logo.getLogos().subscribe((response:any)=>{
      this.about_background = response[0].about_background;
    })
  }

}
