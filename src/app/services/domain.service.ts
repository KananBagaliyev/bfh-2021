import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  constructor() { }

  url:string = "https://revofood.pythonanywhere.com/"
}
