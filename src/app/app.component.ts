import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'crud';

  baseURL = 'REST_API_URL_HERE'
  brandForm:FormGroup;
  isSubmitted = false;
  brandList;

  constructor(
    private _http: HttpClient,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {      
    this.brandForm = this._fb.group({
      id: [0],
      name: ['', Validators.required],
      is_active: [1],
    });

    this.getAll();
  }

  get _fc() { return this.brandForm.controls; }

  save(){
    this.isSubmitted = true;
    if (this.brandForm.invalid) {
        return;
    } else{
      let id = this.brandForm.controls.id.value;
      if(!id){
        this._http.post(this.baseURL+'crud_brands', this.brandForm.value).subscribe(() => {
          alert('Created successfully');
          this.reset();
        });
      } else {
        this._http.put(this.baseURL+'crud_brand/'+id, this.brandForm.value).subscribe(() => {
          alert('Updated successfully');
          this.reset();
        });
      }
    }
  }

  reset(){
    this.brandForm.reset();
    this.brandForm.controls.is_active.setValue(1);
    this.isSubmitted = false;

    this.getAll();
  }

  getAll(){
    
    this._http.get(this.baseURL+'crud_brands').subscribe((result) => {
      this.brandList = result ? result['data'] : [];
    });
  }

  edit(id){
    if(id){
      const brand = this.brandList.find(x => x.id === id);
        if (!brand) return;
        brand.isReading = true;

      this._http.get(this.baseURL+'crud_brand/'+id).subscribe((result) => {
        Object.keys(this.brandForm.controls).forEach(key => {
          this.brandForm.controls[key].setValue(result[key]);
        });
        brand.isReading = false;
        alert('Edit data loaded successfully');
      });
    }
  }

  delete(id){
    var result = confirm("Want to delete?");
    if(id && result){
      const brand = this.brandList.find(x => x.id === id);
        if (!brand) return;
        brand.isDeleting = true;
        
      this._http.delete(this.baseURL+'crud_brand/'+id).subscribe(() => {
        brand.isReading = false;
        this.reset();
        alert('Removed successfully');
      });
    }
  }
}
