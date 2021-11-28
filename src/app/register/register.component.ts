import { Component, OnInit } from '@angular/core';
import {faEye,faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {faGoogle,faFacebookF} from '@fortawesome/free-brands-svg-icons'
import * as $ from 'jquery'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomainService } from '../services/domain.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ViewChild,ElementRef } from '@angular/core';
import Swal from 'sweetalert2'

declare var FB:any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  faEye = faEye;
  faEyeSlash=faEyeSlash;
  faGoogle=faGoogle;
  faFacebook=faFacebookF;

  constructor(private http:HttpClient,private domain:DomainService,private auth:AuthenticationService, private toastr: ToastrService, private router:Router) { 
    this.toastr.toastrConfig.preventDuplicates = true;
  }

  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;
  auth2:any;
  ngOnInit(): void {

    this.FBFunction();
    this.GoogleFunction();
  }


  FBFunction(){
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '887177195511508',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
        
      FB.AppEvents.logPageView();   
        
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  GoogleFunction(){
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '544484661356-u4u601kfl46e0j3s7o2r779c5h4p65e1.apps.googleusercontent.com',
          cookie_policy: 'single_host_origin',
          scope: 'profile email'
        });
        this.GoogleLogin();
      });
    }
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  FBLogin(){
    
    FB.login((response)=>
        {
          if (response.authResponse)
          {
            
            var data = {
              access_token:response.authResponse.accessToken,
              uid:response.authResponse.userID
            }

            this.http.post(this.domain.url+'api/rest-auth/facebook/',data).subscribe((res:any)=>{
              
              localStorage.setItem('user',res.key)
              this.router.navigate(['']).then(()=>{
                location.reload();
              })
            },(err:HttpErrorResponse)=>{
              if(err.error.non_field_errors){
                Swal.fire('Xəta', err.error.non_field_errors[0], 'error')
              }
            })
          }
          else
          {
            this.toastr.error('Kiçik xəta baş verdi. Xahiş edirik biraz sonra yenidən sınayın.', 'Xəta');
          }
    }, {
      scope: 'email', 
      return_scopes: true
      });
  }

  GoogleLogin(){
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
        
        var data = {
          access_token:googleUser.getAuthResponse().access_token
        }
        this.http.post(this.domain.url+'api/rest-auth/google/',data).subscribe((res:any)=>{
          localStorage.setItem('user',res.key)
          this.router.navigate(['/anasehife']).then(()=>{
            location.reload();
          })
        },(err:HttpErrorResponse)=>{
          if(err.error.non_field_errors){
            Swal.fire('Xəta', err.error.non_field_errors[0], 'error')
          }
        })
      }, (error) => {
        this.toastr.error('Kiçik xəta baş verdi. Xahiş edirik biraz sonra yenidən sınayın.', 'Xəta');
      });
  }



  ShowPassword(){
    if ($("#password").attr("type") == "password") {
      $("#password").attr("type", "text");
      $(".faEye").css({'display':'none'})
      $(".faEyeSlash").css({'display':'block'})
    } else {
      $("#password").attr("type", "password");
      $(".faEye").css({'display':'block'})
      $(".faEyeSlash").css({'display':'none'})
    }
  };

  ChangeTab(event){

    if(!$(event.target).hasClass('active')){

      $('.sign_tabs').find('.active').stop(true,true).removeClass('active')

      $(event.target).stop(true,true).addClass('active')
      $('.sign_sides').toggleClass('flip')
    }

  }


  //Older Version of Tab animation (Safari not working)

  // ChangeTab(event){

  //   // $('.login_button').click(function(){
  //   //   document.querySelector(".side").classList.toggle("flip");
  //   // })
    
  //   // $('.register_button').click(function(){
  //   //   document.querySelector(".side").classList.toggle("flip");
  //   // })

  //   if(!$(event.target).hasClass('active')){
  //     let id = $(event.target).data('id')

  //     $('.sign_tabs').find('.active').stop(true,true).removeClass('active')

  //     // if($('.sign_sides').hasClass('flipped')){
  //     //   $('.sign_sides').stop(true,true).removeClass('flipped')
  //     // }
  //     // else{
  //     //   $('.sign_sides').stop(true,true).addClass('flipped')
  //     // }

  //     $(this).stop(true,true).addClass('active')
  //     $(event.target).stop(true,true).addClass('active')

  //     // $('.sign_sides').stop(true,true).css({'transform':'rotateY(90deg)'})

  //     $('.side').each(async function(){
  //       if($(this).data('id')==id){
        
  //         setTimeout(() => {
            
  //           if($('.sign_sides').hasClass('flipped')){
  //             $('.sign_sides').stop(true,true).css({'transform':'rotateY(180deg)'})
  //           }
  //           else{
  //             $('.sign_sides').stop(true,true).css({'transform':'rotateY(0deg)'})
  //           }
            
  //           $('.sign_sides').find('.active').stop(true,true).removeClass('active')
  //           $(this).stop(true,true).addClass('active')

  //         }, 700);
          
  //       }
  //     })
  //   }

  // }

  OnSubmit(name:string,surname:string,email:string,telephone:string,pass:string,confirm_pass:string){

    $('.spinner_register').css({'display':'inline-block'})
    $('.register_button').attr('disabled', 'disabled')

    this.auth.registerUser(name,surname,email,telephone,pass,confirm_pass).subscribe(response=>{

      $('.spinner_register').css({'display':'none'})
      $('.register_button').removeAttr('disabled')
      
      this.router.navigate(['/anasehife'])
      this.toastr.success("Sizin hesabınız müvəffəqiyyətlə yaradıldı. Email ünvanınıza daxil olub təsdiqləməyinizi xahiş edirik.","Qeydiyyat")

    },(err:HttpErrorResponse)=>{
      if(err.error.email){
        this.toastr.error(err.error.email,"Email")
      }
      if(err.error.first_name){
        this.toastr.error(err.error.first_name,"Ad")
      }
      if(err.error.last_name){
        this.toastr.error(err.error.last_name,"Soyad")
      }
      if(err.error.password1){
        this.toastr.error(err.error.password1,"Şifrə")
      }
      if(err.error.password2){
        this.toastr.error(err.error.password2,"Şifrə təkrarı")
      }
      if(err.error.phone){
        this.toastr.error(err.error.phone,"Telefon")
      }
      $('.spinner_register').css({'display':'none'})
      $('.register_button').removeAttr('disabled')
    })
  }

  OnSubmitLogin(email:string,pass:string){
    $('.spinner_login').css({'display':'inline-block'})
    $('.login_button').attr('disabled', 'disabled')
    this.auth.loginUser(email,pass).subscribe((response:any)=>{

      $('.spinner_login').css({'display':'none'})
      $('.login_button').removeAttr('disabled')

      this.router.navigate(['/anasehife'])
      localStorage.setItem('user',response.key)

    },(err:HttpErrorResponse)=>{
      if(err.error.email){
        this.toastr.error(err.error.email,"Email")
      }
      if(err.error.password){
        this.toastr.error(err.error.password,"Şifrə")
      }
      if(err.error.non_field_errors){
        this.toastr.error(err.error.non_field_errors,'Error')
      }
      $('.spinner_login').css({'display':'none'})
      $('.login_button').removeAttr('disabled')
    })
  }


}
