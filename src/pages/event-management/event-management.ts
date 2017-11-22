import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular'

import { CreateEventPage } from './../create-event/create-event';

import { RestApiProvider } from './../../providers/rest-api/rest-api';

import {Observable} from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
/**
 * Generated class for the EventManagementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-management',
  templateUrl: 'event-management.html',
})
export class EventManagementPage {

  private loader: any;

  public events = [];
  public faculties = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private restApiProvider: RestApiProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.getListOfEvents();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.restApiProvider.getEvents()
    .then(result => {
      this.faculties = Object.keys(this.groupByFaculty(result));
      this.events = this.groupByFaculty(result);
      refresher.complete();
    })
    .catch(error =>{
      console.log("ERROR API : getEvents",error);
      refresher.complete();
    })
  }

  getListOfEvents(){
    this.restApiProvider.getEvents()
    .then(result => {
      this.faculties = Object.keys(this.groupByFaculty(result));
      this.events = this.groupByFaculty(result);
    })
    .catch(error =>{
      console.log("ERROR API : getEvents",error);
    })
  }

  groupByFaculty(facultyValues){
    return facultyValues.reduce((groups, facultyed) => {
      let key = "All";
      if(facultyed.Faculty_Name){
        key = facultyed.Faculty_Name;
      }
      if (groups[key]) {
        groups[key].push(facultyed);
      } else {
        groups[key] = [facultyed];
      }
      return groups;
    }, {});
  }

  createEvent(param){
    if (!param) param = {};
    console.log("create")
    this.navCtrl.push(CreateEventPage);
  }

  eventDetails(eid: number){
    console.log(eid);
  }

  eventEdit(eid: number){
    console.log(eid);
  }

  eventDelete(eid: number){
    console.log("Delete event:",eid);
    let confirm = this.alertCtrl.create({
      title: "Alert!",
      message: "Are you sure that you want to delete this event?",
      buttons: [{
        text: "Disagree"
      },{
        text: "Agree",
        handler: () => {
          //TODO - delete the event (use api)
          console.log('Agree clicked');
          this.presentLoading();
          this.restApiProvider.deleteEvent(eid)
          .then(result => {
            console.log("delete event success");
            this.loader.dismiss();
            this.getListOfEvents();
            var jsonData: any = result;
            if(jsonData.isSuccess){
              this.presentAlert(jsonData.message);
            }
          })
          .catch(error =>{
            this.loader.dismiss();
            console.log("ERROR API : deleteEvent",error);
            if(error.status == 0){
              //show error message
              this.presentAlert("Cannot connect to server");
            }else{
              var jsonData = JSON.parse(error.error);
              //show error message
              this.presentAlert(jsonData.message);
            }
          })
        }
      }]
    });
    confirm.present();
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: message,
      buttons: [{
        text: 'Ok'
      }]
    });
    alert.present();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loader.present();
  }

}

