import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-single-property-new-user',
  templateUrl: './single-property-component-new-user.component.html',
  styleUrls: ['./single-property-component-new-user.component.scss']
})
export class SinglePropertyComponentNewUser implements OnInit {

  public copy: string;
  property = [];
  private propertyId: string;
  constructor(
    private commonService: CommonService,
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.propertyId = this.activatedRoute.snapshot.paramMap.get('id')
    if(this.propertyId) this.getPropertyDetails()
  }

  getPropertyDetails() {
    this.commonService.getSingleProperty(this.propertyId).subscribe(data => {
      console.log(data)
      this.property = data.result;
    })

  }


}
