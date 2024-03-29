import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {CommonService} from "../../services/common.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    public userService: UserService,
    private http: HttpClient,
    private router: Router,
    private _formBuilder: FormBuilder,
  ) {
  }

  projectDetails: FormGroup;
  imgUrls = [];
  imgsToUpload = [];
  isSubmittingForm: Boolean = false;

  submitForm() {
    console.log(this.projectDetails.value);
    this.projectDetails.controls['createdBy'].setValue(this.userService.currentUser.user._id);
    this.isSubmittingForm = true;
    // data.value.userId = this.userService.currentUser.user._id;

    const imageData = new FormData();
    this.imgsToUpload.forEach((ele, index) => {
      imageData.append("projImages", ele, ele['name']);
    })
    for (let key in this.projectDetails.controls) {
      // iterate and set other form data
      imageData.append(key, this.projectDetails.get(key).value)
    }
    console.log({ imageData });
    this.commonService.togglePageLoaderFn(true);
    this.http.post(this.commonService.base_url + '/project/newProject', imageData)
      .subscribe(result => {
          console.log({ result });
          let data = result && result['result'] || {};
          let message = result && result['message'] || '';
          if (data && data['slug']) {
            this.commonService.changeHeaderMessage({ type: 'success', message });
            this.router.navigate([`/project/singleProject/${data.slug}`])
          }
          else this.commonService.changeHeaderMessage({ type: 'danger', message: 'Something Went Wrong' });
        }, err => {
          let errmessage = err.error && err.error.message || '';
          console.log({ err }, errmessage);
          this.commonService.changeHeaderMessage({ type: 'danger', message: errmessage });
          this.commonService.togglePageLoaderFn(false);
        },
        () => {
          this.commonService.togglePageLoaderFn(false);
        })
  }


  filesChange(fieldName: string, fileList) {
    console.log({ fileList });
    if (fileList && fileList.length) {
      // this.imgsToUpload = Object.values(fileList);
      let i = 0;
      Object.values(fileList).forEach(f => {
        if (fileList[i].size < 800000) {
          // console.log({ f });
          let reader = new FileReader();
          reader.readAsDataURL(fileList[i]);
          let name = fileList[i].name;
          // console.log(fileList[i]);
          this.imgsToUpload.push(f);
          reader.onload = (_event) => {
            this.imgUrls.push({ name, path: reader.result });
          }
        }
        i++;
      })
    }
    console.log('this.imgUrls', this.imgUrls, this.imgsToUpload);
  }

  removeSinglePic(img) {
    this.imgUrls = this.imgUrls.filter(e => img != e);
  }

  getDataTitleViaId(id, dataList, keyName) {
    if (!id || !dataList || !keyName) return '';

    let data = this[dataList].filter(e => e._id == id);
    return data.length && data[0][keyName] || '';
  }

  projectForm(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      priceFrom: ['', Validators.required],
      priceTo:['', Validators.required],
      location: ['', Validators.required],
      city: ['', Validators.required],
      builder: ['', Validators.required],
      email: ['', Validators.required],
      phoneNo: ['', Validators.required],
      propertyTypes: ['', Validators.required],
      description: [''],
      createdBy: ['']
    });
    }

  ngOnInit() {
    this.projectDetails = this.projectForm();

  }
}
