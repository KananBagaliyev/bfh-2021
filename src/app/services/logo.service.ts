import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainService } from './domain.service';

@Injectable({
  providedIn: 'root'
})
export class LogoService {

  constructor(private domain:DomainService, private http:HttpClient) { }

  getLogos(){
    return this.http.get(this.domain.url+'api/logos/');
  }
}
