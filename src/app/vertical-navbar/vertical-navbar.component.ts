import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {faUser} from '@fortawesome/free-regular-svg-icons'
import {faBoxes, faSignOutAlt, faShoppingCart, faTimes} from '@fortawesome/free-solid-svg-icons'
import * as $ from 'jquery'
import { AuthenticationService } from '../services/authentication.service';
import { LogoService } from '../services/logo.service';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrls: ['./vertical-navbar.component.scss']
})
export class VerticalNavbarComponent implements OnInit {

  faUser = faUser;
  faBoxes = faBoxes;
  faSignOut = faSignOutAlt;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;
  dashboard_logo:string = '';

  constructor(private logo:LogoService, private auth:AuthenticationService, private router:Router) { }

  ngOnInit(): void {
    this.navbarAnimation();
    this.getLogo();
  }

  navbarAnimation(){
    $('.burger_button').click(function(){
      $('.mobile_assets').slideUp();
      $('.nav_column').slideDown().attr('style', 'display: flex !important');
      $('body').css({'overflowY':'hidden'})


    })

    $('.close_button').click(function(){
      $('.nav_column').slideUp()
      $('.mobile_assets').slideDown().attr('style', 'display: flex !important');
      $('body').css({'overflowY':'auto'})

    })
  }

  LogOut(){
    this.auth.logOut().subscribe(response=>{
      localStorage.removeItem('user')
      this.router.navigate(['/anasehife']);
    })
  }

  getLogo(){
    this.logo.getLogos().subscribe((response:any)=>{
      this.dashboard_logo = response[0].dashboard_logo;
    })
  }

}
