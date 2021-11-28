import { Component,AfterViewInit, OnInit  } from '@angular/core';
import {Event, NavigationStart,NavigationCancel,NavigationError, NavigationEnd, Router, ActivationEnd} from '@angular/router'
import * as $ from 'jquery'
import { LoaderService } from './services/loader.service';
import {HttpCancelService} from './services/http-cancel.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'revofood-angular';

  loading = true;


  constructor(private router: Router, public loader:LoaderService, private httpCancelService:HttpCancelService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          break;
        }
        default: {
          break;
        }
      }
    });

    


  }

  ngOnInit(){
  }

  onActivate() {
    $('body').css({'overflowY':'auto'})
  }
  
}
