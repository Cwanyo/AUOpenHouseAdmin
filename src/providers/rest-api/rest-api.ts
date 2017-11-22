import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

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

  public url = 'https://auopenhouse.herokuapp.com/api/authority';
  //public url = 'http://localhost:3000/api/authority';

  constructor(public http: HttpClient) {
    console.log('Hello RestApiProvider Provider');
  }

  login(idToken: string){
    let path = this.url+'/login';

    return new Promise((resolve, reject) => {
      this.http.put(path, {idToken: idToken}, {withCredentials: true})
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
      this.http.get(path, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getFaculties(){
    let path = this.url+'/faculties';
    
    return new Promise((resolve, reject) => {
      this.http.get(path, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getMajorsInFaculty(fid: number){
    let path = this.url+'/faculties/'+fid+'/majors';
    
    return new Promise((resolve, reject) => {
      this.http.get(path, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getEvents(){
    let path = this.url+'/events';
    
    return new Promise((resolve, reject) => {
      this.http.get(path, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getEventTime(eid: number){
    let path = this.url+'/events/'+eid+'/times';

    return new Promise((resolve, reject) => {
      this.http.get(path, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  addEvent(event){
    let path = this.url+'/events';

    return new Promise((resolve, reject) => {
      this.http.post(path, {event: event}, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  editEvent(event){
    let path = this.url+'/events';

    return new Promise((resolve, reject) => {
      this.http.patch(path, {event: event}, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteEvent(eid: number){
    let path = this.url+'/events/'+eid;

    return new Promise((resolve, reject) => {
      this.http.delete(path, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteEventTime(eid: number, tid: number){
    let path = this.url+'/events/'+eid+'/times/'+tid;
    
    return new Promise((resolve, reject) => {
      this.http.delete(path, {withCredentials: true})
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

}
