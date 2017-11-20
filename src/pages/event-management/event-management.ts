import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular'

import { RestApiProvider } from './../../providers/rest-api/rest-api';
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

  public events: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private restApiProvider: RestApiProvider,
    private alertCtrl: AlertController
  ) {
    this.getListOfEvents();
  }

  getListOfEvents(){
    this.restApiProvider.getEvents()
    .then(result => {
      this.events = result;
    })
    .catch(error =>{
      console.log("ERROR API : getEvents",error);
    })
    
  }


}
