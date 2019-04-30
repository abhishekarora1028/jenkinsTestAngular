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
  templateUrl: 'addcontractor.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
})

export class AddcontractorComponent {
private toasterService: ToasterService;
public toasterconfig : ToasterConfig =
      new ToasterConfig({
        tapToDismiss: true,
        timeout: 5000
      });
  editparam: any;
  public uploaderProfile:FileUploader;
  proStatus:any = 0;
  picStatus:any = 0;
  proEditStatus:any = 0;
  rate:any = 0;
  imgUrl: any;
  uniqueEmail:any = 0;
  checkData:any = 0;
  private data: any;
  model: any = {};
  constructor(@Inject(Http) private http: Http, @Inject(Router)private router:Router,private route: ActivatedRoute, toasterService: ToasterService) {
  if(!localStorage.getItem("currentUserId"))
    {
      this.router.navigate(['login']);
    }  

    this.imgUrl = API_URL+'/Containers/';

  if(this.route.snapshot.paramMap.get("id"))
  {
  this.editparam = {
    		id: this.route.snapshot.paramMap.get("id"),
    		action: 'edit'
    	}  

  let options = new RequestOptions();
	        options.headers = new Headers();
	        options.headers.append('Content-Type', 'application/json');
	        options.headers.append('Accept', 'application/json');

	    	this.http.get(API_URL+'/members/'+ this.editparam.id, options)
	        .subscribe(response => {	
	        	this.model = response.json();
	        	this.editparam.action = "edit";
             if(this.model.picstatus!=undefined && this.model.picstatus==1){
                this.http.get(API_URL+'/containers/'+this.model.id+'/files', options)
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



  }else{
  	this.editparam = {
    		id: '',
    		action: 'add'
    	}

    this.model = {    		
        fname:'',
    		lname:'',
        email:'',
    		password:'',
        phone:'',
        gender:'',
        about:'',
    	}	
  }

  this.toasterService = toasterService;

  this.uploaderProfile = new FileUploader({url: '' ,allowedMimeType: ['image/gif','image/jpeg','image/png']});

  this.uploaderProfile.onAfterAddingFile = function(item) {
          //var fileExtension = '.' + item.file.name.split('.').pop();

          //item.file.name = item.file.name + new Date().getTime() + fileExtension;

          item.file.name = item.file.name.split('.')[0]+new Date().getTime()+'.'+item.file.name.split('.')[1];

          console.log(item.file.name)

        };
    
   
  }

keyPress(event: any) {
    //const pattern = /[0-9\ ]/;
    const pattern = /^[a-zA-Z0-9._^%$#!~@+,-]*$/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
}

removePic(contId, picName)
{
  let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

  this.http.delete(API_URL+'/Containers/'+contId+'/files/'+picName+ '?access_token='+localStorage.getItem('currentUserToken'), options)
                      .subscribe(response => {

    this.toasterService.pop('success', 'Success ', "Profile image has deleted successfully!");

    this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+this.editparam.id+'%22%7D', {"picstatus":"0"},  options)
          .subscribe(data => {

     });      

    this.http.get(API_URL+'/members/'+ this.editparam.id, options)
          .subscribe(response => {  
            this.model = response.json();
            this.editparam.action = "edit";
             if(this.model.picstatus!=undefined && this.model.picstatus==1){
                this.http.get(API_URL+'/containers/'+this.model.id+'/files', options)
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

    });

    
}

  onChange(event: any) {
  this.uniqueEmail = 0;
    let options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Content-Type', 'application/json');
            options.headers.append('Accept', 'application/json');
            
     this.http.get(API_URL+'/Members?filter=%7B%22where%22%3A%7B%22email%22%3A%20%22'+event+'%22%7D%7D', options).subscribe(data => {
        if(data.json().length)
        {
          this.uniqueEmail = 0;
          this.uniqueEmail = 1;
        }else{
          this.uniqueEmail = 0;
          this.uniqueEmail = 2;
        }
      });
  }

  disContractor()
  {
    
    let options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append('Content-Type', 'application/json');
          options.headers.append('Accept', 'application/json');

        this.http.get(API_URL+'/Members?filter={"where":{"and":[{"role_id":"2"}]},"order":"id DESC"}', options)
          .subscribe(response => {
          this.router.navigate(['contractors']);
          if(response.json().length)
          {
            this.data = response.json();
            this.checkData = 0;
            this.checkData = 1;
          }else{
            this.checkData = 0;
          }
            
        });
  }

   onSubmit() {
   this.toasterService.clear();
   if(this.editparam.id)
   {
   	  let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json');

    if(this.uploaderProfile.queue.length > 0)
    {
        
        //this.model.picstatus = "1";
        this.http.get(API_URL+'/containers/'+this.editparam.id, options)
          .subscribe(response => { 
                  this.http.get(API_URL+'/containers/'+this.editparam.id+'/files', options)
                  .subscribe(response => {  
                  console.log(response.json())
                  if(response.json().length)
                  {
                    for(let i=0; i< response.json().length; i++ ) {
                        this.http.delete(API_URL+'/Containers/'+this.editparam.id+'/files/'+response.json()[i].name+ '?access_token='+localStorage.getItem('currentUserToken'), options)
                        .subscribe(response => {
                      });

                      }

                  }
                
                });
            }, error => {
                 this.http.post(API_URL+'/Containers?access_token='+ localStorage.getItem('currentUserToken'), {"name":this.editparam.id},  options)
                .subscribe(response => {

                 });
                
          });

           for(let val of this.uploaderProfile.queue){
                val.url = API_URL+'/Containers/'+this.editparam.id +'/upload?access_token='+ localStorage.getItem('currentUserToken');

                //console.log(val);
                val.upload();
            
                this.uploaderProfile.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                    console.log("ImageUpload:uploaded:", item, status);
                    if(status == "200"){
                      let fileStorageData = {
                        memberId: this.editparam.id ,
                        filePath: '/Containers/'+this.editparam.id  ,
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
                      });
                      
                    } else {
                      //this.toasterService.pop('error', 'Error ',  "File: "+item.file.name+" not uploaded successfully");
                    }
                };

              }
         
    }      

      

			this.http.post(API_URL+'/members/update?where=%7B%22id%22%3A%20%22'+this.editparam.id+'%22%7D', this.model,  options)
	        .subscribe(data => {
	      if(data.json().count)
	      {
          console.log(data.json().count)
          this.http.get(API_URL+'/members/'+ this.editparam.id, options)
          .subscribe(response => {  
            this.model = response.json();
            this.editparam.action = "edit";
             
                this.http.get(API_URL+'/containers/'+this.editparam.id+'/files', options)
                    .subscribe(response => {  
                    if(response.json().length)
                    {
                        this.model.profilePic =  response.json()[0].name;
                        this.model.picstatus = 1;
                    }else{
                        this.model.profilePic = '';
                    }
                  });
    
        });
	        //this.proEditStatus = 1;
          this.toasterService.pop('success', 'Updated ', "Contractor has updated successfully!");
          this.disContractor();
	      }else{
	        //this.proEditStatus = 2;
          this.toasterService.pop('error', 'error ', "Error");
          this.disContractor();
	      }
	    });
      
   }else{
	  let options = new RequestOptions();
	          options.headers = new Headers();
	          options.headers.append('Content-Type', 'application/json');
	          options.headers.append('Accept', 'application/json');
            this.model.role_id = '2';
            this.model.role_name = 'contractor'; 
            if(this.uploaderProfile.queue.length > 0)
            {
              this.model.picstatus = 1;
            }else{
              this.model.picstatus = 0;
            }

               
        
	          
	   this.http.post(API_URL+'/members', this.model, options).subscribe(data => {
	      if(data)
	      {
          
            if(this.uploaderProfile.queue.length > 0)
            {
                 this.http.post(API_URL+'/Containers?access_token='+ localStorage.getItem('currentUserToken'), {"name":data.json().id},  options)
                        .subscribe(response => {

                    for(let val of this.uploaderProfile.queue){
                        val.url = API_URL+'/Containers/'+data.json().id+'/upload?access_token='+ localStorage.getItem('currentUserToken');

                        //console.log(val);
                        val.upload();
                    
                        this.uploaderProfile.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                           // console.log("ImageUpload:uploaded:", item, status);
                            if(status == "200"){
                              let fileStorageData = {
                                memberId: data.json().id,
                                filePath: '/Containers/'+data.json().id,
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
                              });
                
                              
                            } else {
                              //this.toasterService.pop('error', 'Error ',  "File: "+item.file.name+" not uploaded successfully");
                            }
                        };

                      }

                  });
         
                } 
	        //this.proStatus = 1;
          this.toasterService.pop('success', 'Added ', "Contractor has added successfully!");
          this.disContractor();
	      }else{
	        //this.proStatus = 2;
          this.toasterService.pop('error', 'error ', "Error");
          this.disContractor();
	      }
	    });
    
	}
  } 

}
