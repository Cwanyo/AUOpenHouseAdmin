import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { RestApiProvider } from './../../providers/rest-api/rest-api';
/**
 * Generated class for the CreateEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage {

  public Faculty: string = "-1";
  public Major: string = "-1";

  public EventTime;
  public MinTime;
  public MaxTime; 

  public listFaculties;
  public listMajors;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private restApiProvider: RestApiProvider,
    private alertCtrl: AlertController
  ) {
    this.getListOfFaculties();
    this.MinTime = new Date().getFullYear().toString();
    this.MaxTime = (new Date().getFullYear() + 1).toString();
    console.log(this.MinTime);
  }

  getListOfFaculties(){
    this.restApiProvider.getFaculties()
    .then(result => {
      this.listFaculties = result;
    })
    .catch(error =>{
      console.log("ERROR API : getFaculties",error);
    })
  }

  hintMajors(fid: number){
    this.Major = "-1";
    if(fid == -1){
      this.listMajors = null;
      return;
    }
    this.restApiProvider.getMajorsInFaculty(fid)
    .then(result => {
      this.listMajors = result;
    })
    .catch(error =>{
      console.log("ERROR API : getMajorsInFaculty",error);
    })
  }

  //TODO - upload Image
  //TODO - add location

}
