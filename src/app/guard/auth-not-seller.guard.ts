import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthNotSellerGuard implements CanActivate {
  constructor(private router:Router, private auth:AuthenticationService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('user')!=null){
        this.auth.getUser().subscribe((response:any)=>{
          if(!response.seller){
            return true;
          }
          this.router.navigate(['/dashboard'])
        });
        return true;
      }

      this.router.navigate(['/account/register'])

      return false;
  }
  
}
