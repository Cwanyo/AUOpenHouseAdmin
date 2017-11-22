import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Event } from './event.interface';

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

  private loader: any;

  public eventForm: FormGroup;

  public minSelectabledate;
  public maxSelectabledate;

  public listFaculties;
  public listMajors;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private restApiProvider: RestApiProvider,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.getListOfFaculties();

    let d = new Date();
    this.minSelectabledate = d.getFullYear();
    this.maxSelectabledate = d.getFullYear()+1;
    
  }
  
  //TODO - validate time
  //TODO - default timezone
  //TODO - upload Image
  //TODO - add location

  ngOnInit(){
   this.initEvent();
  }

  initEvent(){
    this.eventForm = this.formBuilder.group({
      Name: ["", [Validators.required]],
      Info: ["", [Validators.required]],
      Image: "",
      Location_Latitude: "",
      Location_Longitude: "",
      Event_Time: this.formBuilder.array([
        this.initEventTime(),
      ]),
      MID: ["-1", [Validators.required]],
      FID: ["-1", [Validators.required]]
    });
  }

  initEventTime(){
    return this.formBuilder.group({
      Time_Start: ["", [Validators.required]],
      Time_End: ["", [Validators.required]]
    });
  }

  addEventTime() {
    const control = <FormArray>this.eventForm.controls["Event_Time"];
    control.push(this.initEventTime());
  }

  removeEventTime(i: number) {
    const control = <FormArray>this.eventForm.controls["Event_Time"];
    control.removeAt(i);
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
    this.eventForm.patchValue({MID:"-1"});
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

  addEvent(){
    //get form data
    let event = this.eventForm.value;

    //Change empty to NULL
    if(event.Image == ""){
      console.log("in")
      event.Image = null;
    }
    if(event.Location_Latitude == ""){
      event.Location_Latitude = null;
    }
    if(event.Location_Longitude == ""){
      event.Location_Longitude = null;
    }
    if(event.FID == "-1"){
      event.FID = null;
    }
    if(event.MID == "-1"){
      event.MID = null;
    }
    //--
    this.presentLoading();
    this.restApiProvider.addEvent(event)
    .then(result => {
      this.loader.dismiss();
      console.log("add event success");
      var jsonData: any = result;
      if(jsonData.isSuccess){
        this.presentAlert(jsonData.message);
        this.navCtrl.pop();
      }
    })
    .catch(error =>{
      this.loader.dismiss();
      console.log("ERROR API : addEvent",error);
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
