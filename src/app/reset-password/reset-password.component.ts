import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  uid:string = ''
  token:string = '';

  constructor(private http:HttpClient, private activatedRoute:ActivatedRoute, private domain:DomainService, private toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params =>{
      this.uid = params.uid;
      this.token = params.token;
      
      
    })
  }

  ResetPassword(data_){
    
    var data = {
      new_password1 : data_.pass,
      new_password2 : data_.reset_pass,
      uid : this.uid,
      token : this.token
    }
    this.http.post(this.domain.url+'api/rest-auth/password/reset/confirm/',data).subscribe(response=>{
      this.router.navigate(['/anasehife']);
      this.toastr.success('Şifrəniz müvəffəqiyyətlə sıfırlandı.',"Şifrə sıfırlama");

    },(err:HttpErrorResponse)=>{
      if(err.error.new_password1){
        this.toastr.error(err.error.new_password1,"Şifrə")
      }
      if(err.error.new_password2){
        this.toastr.error(err.error.new_password2,"Şifrə təkrarı")
      }
      if(err.error.uid){
        this.toastr.error('Xahiş edirik yenidən sınayasınız',"Xəta")
      }
      if(err.error.token){
        this.toastr.error('Xahiş edirik yenidən sınayasınız',"Xəta")
      }
    })
  }

}
