import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomainService } from '../services/domain.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private http:HttpClient, private domain:DomainService, private toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {
  }

  ForgetPassword(data){
    
    this.http.post(this.domain.url+'api/rest-auth/password/reset/',data).subscribe(response=>{
      this.router.navigate(['/anasehife']);
      this.toastr.success('Email ünvanınıza şifrənizi sıfırlamaq üçün təlimat göndərildi.','Şifrə sıfırlama')
    },(err:HttpErrorResponse)=>{
      if(err.error.email){
        this.toastr.error(err.error.email,"Email")
      }
    })
  }

}
