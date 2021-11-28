import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomainService } from '../services/domain.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  token:string = '';
  loading_status:boolean = undefined;
  constructor(private activatedRoute:ActivatedRoute,private domain:DomainService, private http:HttpClient) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params =>{
      this.token = params.token;
      
      

      this.http.get(this.domain.url+'api/rest-auth/registration/account-confirm-email/'+params.token+'/').subscribe(response=>{
        
        this.loading_status = true;
      },(err:HttpErrorResponse)=>{
        
        this.loading_status = false
      })
      
    })
  }

}
