import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Event } from './../../interface/event';

import { RestApiProvider } from './../../providers/rest-api/rest-api';

/**
 * Generated class for the EditEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {

  public event: Event;
  public deleteEventTime = [];

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
    this.event = navParams.get("event");
    console.log("Event",this.event);
  }

  ngOnInit(){
    this.getListOfFaculties();

    let d = new Date();
    this.minSelectabledate = d.getFullYear();
    this.maxSelectabledate = d.getFullYear()+1;

    this.initEvent();
  }
  
  initEvent(){
    //Change NULL to empty 
    if(this.event.Image == null){
      this.event.Image = "";
    }
    if(this.event.Location_Latitude == null){
      this.event.Location_Latitude = "";
    }
    if(this.event.Location_Longitude == null){
      this.event.Location_Longitude = "";
    }
    if(this.event.FID == null){
      this.event.FID = "-1";
    }
    if(this.event.MID == null){
      this.event.MID = "-1";
    }
    //--
    this.eventForm = this.formBuilder.group({
      EID: this.event.EID.toString(),
      Name: [this.event.Name.toString(), [Validators.required]],
      Info: [this.event.Info.toString(), [Validators.required]],
      Image: this.event.Image.toString(),
      State: this.event.State.toString(),
      Location_Latitude: this.event.Location_Latitude.toString(),
      Location_Longitude: this.event.Location_Longitude.toString(),
      Event_Time: this.formBuilder.array([]),
      MID: [this.event.MID.toString(), [Validators.required]],
      FID: [this.event.FID.toString(), [Validators.required]]
    });
    //set major 
    this.hintMajors(Number(this.event.FID));
    this.eventForm.patchValue({MID: this.event.MID.toString()});
    //set event time
    this.initEventTime();
  }

  convertTime(time: string){
    let temp = time.split(" ");
    return temp[0]+"T"+temp[1]+".000Z"
  }

  initEventTime(){
    this.restApiProvider.getEventTime(Number(this.event.EID))
    .then(result => {
      let json: any = result;
      json.forEach(t => {
        const control = <FormArray>this.eventForm.controls["Event_Time"];
        control.push(this.formBuilder.group({
          TID: t.TID,
          Time_Start: [this.convertTime(t.Time_Start), [Validators.required]],
          Time_End: [this.convertTime(t.Time_End), [Validators.required]]
        }));
      });
    })
    .catch(error =>{
      console.log("ERROR API : getEventTime",error);
    })
  }

  addEventTime() {
    const control = <FormArray>this.eventForm.controls["Event_Time"];
    control.push(this.formBuilder.group({
      Time_Start: ["", [Validators.required]],
      Time_End: ["", [Validators.required]]
    }));
  }

  removeEventTime(i: number) {
    if(this.eventForm.get('Event_Time').value[i].TID){
      //if TID is exits and be removed 
      this.deleteEventTime.push(this.eventForm.get('Event_Time').value[i].TID);
    }
    const control = <FormArray>this.eventForm.controls["Event_Time"];
    control.removeAt(i);
  }

  submitEvent(){
    let confirm = this.alertCtrl.create({
      title: "Alert!",
      message: "Are you sure that you want to edit this event?",
      buttons: [{
        text: "Disagree"
      },{
        text: "Agree",
        handler: () => {
          //get form data
          let event: Event = this.eventForm.value;
          
          //Change empty to NULL
          if(event.Image == ""){
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
          //delete event if exist
          this.deleteEvent(Number(event.EID));
          //edit event
          this.editEvent(event);
        }
      }]
    });
    confirm.present();
    
  }

  deleteEvent(eid: number){
    this.deleteEventTime.forEach(tid => {
      this.restApiProvider.deleteEventTime(eid, tid)
      .then(result => {
        console.log("delete event success");
      })
      .catch(error =>{
        console.log("ERROR API : deleteEventTime",error);
      });
    });
  }

  editEvent(event: Event){
    this.restApiProvider.editEvent(event)
    .then(result => {
      this.loader.dismiss();
      console.log("edit event success");
      var jsonData: any = result;
      if(jsonData.isSuccess){
        this.presentAlert(jsonData.message);
        //refresth list of event on the main event page
        this.navParams.get("parentPage").getListOfEvents();
        this.navCtrl.popToRoot();
      }
    })
    .catch(error =>{
      this.loader.dismiss();
      console.log("ERROR API : editEvent",error);
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
