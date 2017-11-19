import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
/*
  Generated class for the RestApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestApiProvider {

  public url = 'https://auopenhouse.herokuapp.com/api/authority'

  constructor(public http: HttpClient) {
    console.log('Hello RestApiProvider Provider');
  }

  login(idToken: string){
    let path = this.url+'/login';

    return new Promise((resolve, reject) => {
      this.http.put(path, {idToken:idToken})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  logout(){
    let path = this.url+'/logout';

    return new Promise((resolve, reject) => {
      this.http.get(path)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  /*getLicensePlate(image:any){
    let apiUrl = 'https://api.openalpr.com/v2/recognize_bytes';
    let params = new HttpParams();
    params = params.append('secret_key', environment.openalpr.secretKey);
    params = params.append('recognize_vehicle', '0');
    params = params.append('country', 'th');
    params = params.append('return_image', '0');
    params = params.append('topn', '5');

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type','application/json');
    headers = headers.append('Accept', 'application/json');

    return new Promise((resolve, reject) => {
      this.http.post(apiUrl, image, {headers: headers, params: params, observe: "body"})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });

  }*/

}
