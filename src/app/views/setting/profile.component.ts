import { Component, OnInit } from '@angular/core';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup }  from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import * as $ from 'jquery';
import { API_URL } from '../../globals';

// Toastr
import { ToasterModule, ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';

// Ng2-file-upload
import { FileSelectDirective, FileDropDirective, FileUploadModule, FileUploader } from 'ng2-file-upload';


@Component({
  templateUrl: 'profile.component.html',
   styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
})

export class ProfileComponent {
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
  public uploaderProfile:FileUploader;
  editparam: any;
  imgUrl: any;
  proStatus:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  uniqueEmail:any = 0;
  conData:any;
  private data: any;
  model: any = {};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router,private route: ActivatedRoute, toasterService: ToasterService) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }

 this.imgUrl = API_URL+'/Imagecontainers/';   

let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

let userId = localStorage.getItem('currentUserId');          


this.http.get(API_URL+'/members/'+userId, options)
          .subscribe(response => {  
            this.model = response.json();
             if(this.model.picstatus!=undefined && this.model.picstatus==1){
                this.http.get(API_URL+'/Imagecontainers/'+userId+'/files', options)
                    .subscribe(response => {  
                    if(response.json().length)
                    {
                        this.model.profilePic =  response.json()[0].name;
                    }
                  });
              }else{
                        this.model.profilePic = '';
                    }
        });

  this.toasterService = toasterService;

  this.uploaderProfile = new FileUploader({url: '' ,allowedMimeType: ['image/gif','image/jpeg','image/png']});

  this.uploaderProfile.onAfterAddingFile = function(item) {
          //var fileExtension = '.' + item.file.name.split('.').pop();

          //item.file.name = item.file.name + new Date().getTime() + fileExtension;

          item.file.name = item.file.name.split('.')[0]+new Date().getTime()+'.'+item.file.name.split('.')[1];

        };      


}

removePic(contId, picName)
{
  let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

  this.http.delete(API_URL+'/Imagecontainers/'+contId+'/files/'+picName+ '?access_token='+localStorage.getItem('currentUserToken'), options)
                      .subscribe(response => {

    this.toasterService.pop('success', 'Success ', "Profile image has deleted successfully!");

    this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+contId+'%22%7D', {"picstatus":"0"},  options)
          .subscribe(data => {

     });      

    this.http.get(API_URL+'/members/'+contId, options)
          .subscribe(response => {  
            this.model = response.json();
          
        });

    });

    
}

onChange(event: any) {
  this.uniqueEmail = 0;
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');
            
     this.http.get(API_URL+'/Members?filter=%7B%22where%22%3A%7B%22email%22%3A%20%22'+event+'%22%7D%7D', options).subscribe(data => {
     //console.log(data._body)
        if(data.json().length)
        {
          this.uniqueEmail = 0;
          if(localStorage.getItem("currentUserId")!=data.json()[0].id)
          {
            this.uniqueEmail = 1;
          }
        }else{
          this.uniqueEmail = 0;
          this.uniqueEmail = 2;
        }
      });
}

onSubmit() {
this.toasterService.clear();  
let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');

let userId = localStorage.getItem('currentUserId');           

    if(this.uploaderProfile.queue.length > 0)
    {
        
        this.http.get(API_URL+'/Imagecontainers/'+userId, options)
          .subscribe(response => { 
                  this.http.get(API_URL+'/Imagecontainers/'+userId+'/files', options)
                  .subscribe(response => {  
                  if(response.json().length)
                  {
                    for(let i=0; i< response.json().length; i++ ) {
                        this.http.delete(API_URL+'/Imagecontainers/'+userId+'/files/'+response.json()[i].name+ '?access_token='+localStorage.getItem('currentUserToken'), options)
                        .subscribe(response => {
                      });

                      }

                  }

              for(let val of this.uploaderProfile.queue){
                val.url = API_URL+'/Imagecontainers/'+userId+'/upload?access_token='+ localStorage.getItem('currentUserToken');

                //console.log(val);
                val.upload();
            
                this.uploaderProfile.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                    //console.log("ImageUpload:uploaded:", item, status);
                    if(status == "200"){
                      /*let fileStorageData = {
                        memberId: userId ,
                        filePath: '/Imagecontainers/'+userId,
                        fileName: item.file.name,
                        fileTitle: '',  
                        uploadType: 'profile',
                        eventId: '',                  
                        status: 'active',  
                        created_by: localStorage.getItem('currentUserId'),  
                        updated_by: ''
                      }

                      this.http.post(API_URL+'/FileStorages?access_token='+ localStorage.getItem('currentUserToken'), fileStorageData ,  options)
                      .subscribe(storageRes => {
                        //console.log(storageRes.json());
                      }, error => {
                          //console.log(JSON.stringify(error.json()));
                      });*/

                      this.model.picstatus = 1;

                      this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+userId+'%22%7D', this.model,  options)
                        .subscribe(data => {
                      if(data.json().count)
                      {
                        this.http.get(API_URL+'/members/'+userId, options)
                        .subscribe(response => {  
                          this.model = response.json();
                          this.model.profilePic =  item.file.name;
                  
                      });
                        this.proEditStatus = 1;
                        this.toasterService.pop('success', 'Updated ', "Profile has updated successfully!");
                        
                      }else{
                        this.proEditStatus = 2;
                        this.toasterService.pop('error', 'error ', "Error");
                        
                      }
                    });
                      
                    } else {
                      //this.toasterService.pop('error', 'Error ',  "File: "+item.file.name+" not uploaded successfully");
                    }
                };

              }
                
                });
            }, error => {
                 this.http.post(API_URL+'/Imagecontainers?access_token='+ localStorage.getItem('currentUserToken'), {"name":userId},  options)
                .subscribe(response => {

                    for(let val of this.uploaderProfile.queue){
                val.url = API_URL+'/Imagecontainers/'+userId+'/upload?access_token='+ localStorage.getItem('currentUserToken');

                //console.log(val);
                val.upload();
            
                this.uploaderProfile.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                    //console.log("ImageUpload:uploaded:", item, status);
                    if(status == "200"){
                      /*let fileStorageData = {
                        memberId: userId ,
                        filePath: '/Imagecontainers/'+userId,
                        fileName: item.file.name,
                        fileTitle: '',  
                        uploadType: 'profile',
                        eventId: '',                  
                        status: 'active',  
                        created_by: localStorage.getItem('currentUserId'),  
                        updated_by: ''
                      }

                      this.http.post(API_URL+'/FileStorages?access_token='+ localStorage.getItem('currentUserToken'), fileStorageData ,  options)
                      .subscribe(storageRes => {
                        //console.log(storageRes.json());
                      }, error => {
                          //console.log(JSON.stringify(error.json()));
                      });*/

                      this.model.picstatus = 1;

                      this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+userId+'%22%7D', this.model,  options)
                        .subscribe(data => {
                      if(data.json().count)
                      {
                        this.http.get(API_URL+'/members/'+userId, options)
                        .subscribe(response => {  
                          this.model = response.json();
                          this.model.profilePic =  item.file.name;
                  
                      });
                        this.proEditStatus = 1;
                        this.toasterService.pop('success', 'Updated ', "Profile has updated successfully!");
                        
                      }else{
                        this.proEditStatus = 2;
                        this.toasterService.pop('error', 'error ', "Error");
                        
                      }
                    });
                      
                    } else {
                      //this.toasterService.pop('error', 'Error ',  "File: "+item.file.name+" not uploaded successfully");
                    }
                };

              }

                 });
                
          });
         
    }else{

        this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+userId+'%22%7D', this.model,  options)
          .subscribe(data => {
        if(data.json().count)
        {
          this.http.get(API_URL+'/members/'+userId, options)
          .subscribe(response => {  
            this.model = response.json();
    
        });
          this.proEditStatus = 1;
          this.toasterService.pop('success', 'Updated ', "Profile has updated successfully!");
          
        }else{
          this.proEditStatus = 2;
          this.toasterService.pop('error', 'error ', "Error");
          
        }
      });
    }              



/*this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+userId+'%22%7D', this.model,  options)
    .subscribe(data => {
  if(data)
  {
    this.proEditStatus = 1;
  }else{
    this.proEditStatus = 2;
  }
});*/




} 

}
