import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomainService } from '../services/domain.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  incomes:any[] =[];
  sellings:any[]= [];
  chart_data:number[] = [65, 59, 80, 81, 56, 55, 50]

  public chartColors: Array<any> = [
    { // first color
      backgroundColor: '#5e995c',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      borderRadius:'200px',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }];

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };  public barChartLabels = ['Bazar Ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə Axşamı', 'Cümə', 'Şənbə', 'Bazar'];
  public barChartType = 'bar';
  public barChartLegend = true;  
  public barChartData;

  constructor(private http:HttpClient, private domain:DomainService) { }

  ngOnInit(): void {
    this.getIncome();
    this.getSellings();
    this.getChartData();
  }

  getIncome(){
    this.http.get(this.domain.url+'api/income/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
      this.incomes=response;
      
    })
  }

  getSellings(){
    this.http.get(this.domain.url+'api/sellings/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
      this.sellings = response
      
    })
  }

  getChartData(){
    this.http.get(this.domain.url+'api/last-week-incomes/',{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
      this.chart_data = response
      this.barChartData = [
        {data: response, label: 'Qazanc'}
      ];
    })
  }

}
