import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DomainService } from '../services/domain.service';
import * as mapboxgl from 'mapbox-gl';
import * as $ from 'jquery';
import { EmailValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  current_user:any='';

  longitude:number = 49.8671;
  latitude:number= 40.4093;
  map:any;
  marker:any;
  new_address:any;

  

  geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
      watchPosition: true
    },
    trackUserLocation: true
  });

  constructor(private http:HttpClient, private domain:DomainService, private auth:AuthenticationService, private toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken:'pk.eyJ1IjoiYmdseXZ2IiwiYSI6ImNraHJoMTA1NTEzN2YzMHA1Mjdxa2N4cjYifQ.JbE14lnRaO5sIIDaGBlvNg',
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [this.longitude,this.latitude], // starting position [lng, lat]
      zoom: 10 // starting zoom
    });

    
    this.marker = new mapboxgl.Marker({draggable: true}).setLngLat(this.map.getCenter()).addTo(this.map);

    this.map.addControl(this.geolocate);

    this.geolocate.on('geolocate',(e)=>{
      this.marker.setLngLat([e.coords.longitude,e.coords.latitude])
    })


    this.marker.setLngLat(this.map.getCenter())


    // this.map.on('movestart', function(e) {
    //   this.marker.setLngLat(this.map.getCenter());
    // });
    
    // this.map.on('move', function(e) {
    //   this.marker.setLngLat(this.map.getCenter());
    // });
    

    
    this.getCurrentUser();

    
    
  }


  ChangeBasics(data){
    
    this.auth.getUser().subscribe((response:any)=>{

      var new_data = {
        first_name:data.name,
        last_name:data.surname,
        email:data.email,
        phone:data.phone,
      }

      this.http.patch(this.domain.url+'api/users/'+response.pk+'/',new_data,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((res:any)=>{
        this.getCurrentUser()
        

      },(err:HttpErrorResponse)=>{
        if(err.error.first_name){
          this.toastr.error(err.error.first_name,"Ad")
        }
        if(err.error.last_name){
          this.toastr.error(err.error.last_name,"Soyad")
        }
        if(err.error.email){
          this.toastr.error(err.error.email,"Email")
        }
        if(err.error.phone){
          this.toastr.error(err.error.phone,"Telefon")
        }
      })
      
    })
  }

  getCurrentUser(){
    this.auth.getUser().subscribe((response:any)=>{
      this.http.get(this.domain.url+'api/users/'+response.pk+'/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe(res=>{
        this.current_user = res;
        
        if(this.current_user.address!=""){
          this.map.flyTo({center:this.current_user.address.split(',')})
          this.marker.setLngLat(this.current_user.address.split(','))
        }

      })
    })
    
  }

  ChangeAddress(data){
    this.auth.getUser().subscribe((response:any)=>{

      this.new_address = {
        address:this.marker.getLngLat().lng+','+this.marker.getLngLat().lat
      }
      if(data.postal_cod!=""){
        this.new_address.postal_code=data.postal_code
      }
      if(data.villag!=""){
        this.new_address.rayon=data.village
      }
      if(data.cit!=""){
        this.new_address.city=data.city
      }
      this.http.patch(this.domain.url+'api/users/'+response.pk+'/',this.new_address,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((resx:any)=>{
        this.getCurrentUser()

      },(err:HttpErrorResponse)=>{
        if(err.error.city){
          this.toastr.error(err.error.city,"Şəhər")
        }
        if(err.error.rayon){
          this.toastr.error(err.error.rayon,"Rayon")
        }
        if(err.error.postal_code){
          this.toastr.error(err.error.postal_code,"Poçt kodu")
        }
        if(err.error.address){
          this.toastr.error(err.error.address,"Ünvan")
        }
      })
      
    })
    // 
    // 
  }

  ChangePass(data){
    this.http.post(this.domain.url+'api/rest-auth/password/change/',data,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe(response=>{
      localStorage.removeItem("user");
      this.router.navigate(['/home']);
      this.toastr.success("Şifrəniz müvəffəqiyyətlə dəyişdirildi","Şifrə dəyişikliyi")

    },(err:HttpErrorResponse)=>{
      if(err.error.old_password){
        this.toastr.error(err.error.old_password,"İndiki şifrə")
      }
      if(err.error.new_password1){
        this.toastr.error(err.error.new_password1,"Yeni şifrə")
      }
      if(err.error.new_password2){
        this.toastr.error(err.error.new_password2,"Yeni şifrə təkrarı")
      }
    })
  }

}
