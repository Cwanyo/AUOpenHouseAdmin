import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular'

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

  public events = [];
  public faculties = [];
  public eventSub: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private restApiProvider: RestApiProvider,
    private alertCtrl: AlertController
  ) {
    this.getListOfEvents();
    //(sub) auto refresh at 10 sec 
    this.eventSub = Observable.interval(10000).subscribe(x => {
      this.getListOfEvents();
    });
  }

  ngOnDestroy(){
    console.log("ngOnDestroy event-management")
    //(unsub) auto refresh at 10 sec 
    this.eventSub.unsubscribe();
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
        }
      }]
    });
    confirm.present();
  }


}

