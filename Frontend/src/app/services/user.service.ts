import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(
    private commonService: CommonService,
    private http: HttpClient
  ) { }

  get currentUser(){
    var token = localStorage.getItem('token');
    if(!token) return null;

    let jwtHelper = new JwtHelper();
    // console.log('decoded ', jwtHelper.decodeToken(token));

    return jwtHelper.decodeToken(token);
  }

  getcurrentUserDetails(userId){
    return this.http.get<any>(this.commonService.base_url + '/auth/getProfile/' + userId);
  }

  updateUserDetails(userId, body){
    return this.http.post<any>(this.commonService.base_url + '/auth/updateProfile/' + userId, body);
  }

  signUp(body) {
    return this.http.post(this.commonService.base_url + '/auth/user/register', body);
  }

  makePayment(body) {
    return this.http.post<any>(this.commonService.base_url + '/pay/',body)
  }

}
