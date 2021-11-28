import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {ApiCallService} from '../services/api-call.service'
import {Category}from '../models/category'
import {Type}from '../models/type'
import {Class}from '../models/class'
import {Size}from '../models/size'
import { Brand } from '../models/brand';
import * as $ from 'jquery';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomainService } from '../services/domain.service';
import {FormGroup, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common'
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
  providers: [DatePipe]
})

export class NewProductComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  

  faPlus = faPlus;

  sale_date:any

  image!:File;
  images:any[] = [];

  photo_counter:number[] = [-1];
  photo_count:number = -1;

  size_counter:number[] = [-1];
  size_count:number = -1;

  product_counts_sizes:any[]=[]
  
  public Editor = ClassicEditor;
  public Editor3 = ClassicEditor;

  categories:Category[]= [];
  types:Type[] = [];
  classes:Class[] = [];
  brands:Brand[]= [];
  sizes:Size[] = [];

  description:string="";
  delivery:string="";

  sale:boolean = false;

  db_photos:number[] = [];
  db_size_items:any[] = [];


  constructor(private toastr:ToastrService, private product_property:ApiCallService, private http:HttpClient, private domain:DomainService, private datePipe: DatePipe) { 
    
  }

  ngOnInit(): void {

    this.getCategories();
    // this.getTypes();
    // this.getClasses();
    this.getBrands();
    this.getSizes();
  }


  OnChange(event:any){
    if(event.target.files.length>0){
      this.imageChangedEvent = event;
      this.image = event.target.files[0];
      var reader = new FileReader();
          
      reader.onload = function(e:any) {
        $('#photo_uploader_helper').attr('src', e.target.result);
      }

      $('#my_modal').css({'display':'block'})
      $('body').css({'overflowY':'hidden'})
      
      reader.readAsDataURL(event.target.files[0]); // convert to base64 string
       
    }
  }

  saleAction(sale){
    if(this.sale ===true){
      $(".sale_form_right").css({'display':'block'})
      $(".sale_form_date").css({'display':'block'})
    }

    else{
      $(".sale_form_right").css({'display':'none'})
      $(".sale_form_date").css({'display':'none'})
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.image = this.base64ToFile(
      event.base64,
      this.image.name,
    )

  }

  base64ToFile(data:any, filename:any) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }


    return new File([u8arr], filename, { type: mime });
  }

  AllDone(){
    var reader = new FileReader();
    $('#photo_uploader_helper_'+this.photo_count).attr('src', this.croppedImage);
    $('#my_modal').css({'display':'none'})
    $('body').css({'overflowY':'auto'})

    if(!this.photo_counter.includes(this.photo_count)){
      this.photo_counter.push(this.photo_count);
    }

    if(this.images.findIndex(r=>r.Index===this.photo_count)!=-1){
      var index = this.images.findIndex(r=>r.Index===this.photo_count)
      this.images[index].File = this.image
    }

    else{
      this.images.push({File:this.image,Index:this.photo_count});
    }
    
    
  }

  getCategories(){
    this.product_property.Categories().subscribe((response:Category[])=>{
      this.categories = response;
    })
  }

  getCategoryName(c){
    this.getTypes(c)
    // this.getClasses(c)
    
  }

  getTypeName(c,t){
    
    this.http.get(this.domain.url+'api/class-type-category/'+c+'/'+t+'/').subscribe((response:any)=>{
      
      this.classes = response
    })
  }
  

  getTypes(cat_id){
    this.http.get(this.domain.url+'api/type-category/'+cat_id+'/').subscribe((response:any)=>{
      this.types = response
    })
  }

  getClasses(cat_id){
    this.http.get(this.domain.url+'api/class-category/'+cat_id+'/').subscribe((response:any)=>{
      this.classes = response
    })
  }

  getBrands(){
    this.product_property.Brands().subscribe((response:Brand[])=>{
      this.brands = response;
    })
  }

  getSizes(){
    this.product_property.Sizes().subscribe((response:Size[])=>{
      this.sizes = response;
    })
  }

  OnSubmit(name,description,delivery,price,sale,sale_price,sale_date,category,type,classx,amount){
    var slugify = require('slugify')

    var data_product = new FormData();
    
    for(let image of this.images){
      data_product.append('images',image.File,image.File.name)
    }

      var data_size_item = {
        quantity:amount,
        size:39
      }

      data_product.append('sizes',JSON.stringify(data_size_item))

      data_product.append('name', name)
      data_product.append('slug',slugify(name)+'-'+Math.floor(Math.random() * Math.floor(111111111)))
      data_product.append('description', description)
      data_product.append('shipping_info', delivery)
      data_product.append('price', price)
      data_product.append('color', "ordinary")
      data_product.append('discount_state', sale)
      data_product.append('category', category)
      data_product.append('types', type)
      data_product.append('classes', classx)
      data_product.append('firm', '10')
      
      

    if(sale == true){
      data_product.append('discount_price', sale_price)
      data_product.append('discount_start_date',  this.datePipe.transform(sale_date.start, 'YYYY-MM-dd HH:mm'))
      data_product.append('discount_finish_date',this.datePipe.transform(sale_date.end, 'YYYY-MM-dd HH:mm'))
      
    }

    if(data_product.getAll('images').length==0 || data_product.getAll('sizes').length==0){
      if(data_product.getAll('images').length==0){
        this.toastr.error('Xahiş edirik məhsulunuz üçün şəkil seçəsiniz','Şəkil')
      }
      if(data_product.getAll('sizes').length==0){
        this.toastr.error('Xahiş edirik məhsulunuz üçün ölçü seçəsiniz','Ölçü')
      }

    }

    else if(data_product.getAll('images').length!=0 && data_product.getAll('sizes').length!=0){
      this.http.post(this.domain.url+'api/goods/',data_product,{headers:new HttpHeaders({'Authorization':'Token '+localStorage.getItem('user'),'Accept-Language':'az-Latn'})}).subscribe((response:any)=>{
        
        Swal.fire('Qeyd.', 'Məhsul müvəffəqiyyətlə yaradıldı. Təsdiqi gözləyin.', 'success').then(()=>{
          location.reload();
        })
        // this.toastr.success('Məhsul müvəffəqiyyətlə yaradıldı. Təsdiqi gözləyin.','Qeyd')
      },(err:HttpErrorResponse)=>{
        if(err.error.category){
          this.toastr.error(err.error.category,"Kateqoriya")
        }
        if(err.error.classes){
          this.toastr.error(err.error.classes,"Sinif")
        }
        if(err.error.firm){
          this.toastr.error(err.error.firm,"Firma")
        }
        if(err.error.name){
          this.toastr.error(err.error.name,"Ad")
        }
        if(err.error.price){
          this.toastr.error(err.error.price,"Qiymət")
        }
        if(err.error.types){
          this.toastr.error(err.error.types,"Tip")
        }
        if(err.error.images){
          this.toastr.error(err.error.images,"Şəkil")
        }
        if(err.error.sizes){
          this.toastr.error(err.error.sizes,"Ölçü")
        }
        if(err.error.discount_finish_date){
          this.toastr.error(err.error.discount_finish_date,"Endirim bitmə tarixi")
        }
        if(err.error.discount_start_date){
          this.toastr.error(err.error.discount_start_date,"Endirim başlama tarixi")
        }
        if(err.error.description){
          this.toastr.error(err.error.description,"Açıqlama")
        }
      })
    }
    

    

  }


  addPhoto(int:number){
    $('.photo_uploader_'+int).trigger('click')
    this.photo_count = int;
  }



  addSize(row,type,size?){
    this.size_count = row;
    var p_count = $("#product_count_"+this.size_count).val();
    var p_size = size;


    if(this.product_counts_sizes.findIndex(p=>p.index===row)!=-1){
      var index = this.product_counts_sizes.findIndex(p=>p.index===row)
      if(type=="s"){
        this.product_counts_sizes[index].size = p_size
      }
      else if(type=="c"){
        this.product_counts_sizes[index].count = p_count
      }
      
    }
  
    else{
      this.product_counts_sizes.push({size:p_size,count:p_count,index:row})
    }

    
  }

  addMoreSize(){
    if(!this.size_counter.includes(this.size_count)){
      this.size_counter.push(this.size_count);
    }

    
  }


}
