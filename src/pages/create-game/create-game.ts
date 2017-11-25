import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Loading } from 'ionic-angular/components/loading/loading';

import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Game } from './../../interface/Game';

import { RestApiProvider } from './../../providers/rest-api/rest-api';

/**
 * Generated class for the CreateGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-game',
  templateUrl: 'create-game.html',
})
export class CreateGamePage {

  private loader: Loading;
  
  public gameForm: FormGroup;

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
  }

  ngOnInit(){
    this.getListOfFaculties();

    let d = new Date();
    this.minSelectabledate = d.getFullYear();
    this.maxSelectabledate = d.getFullYear()+1;

    this.initGame();
  }

  initGame(){
    this.gameForm = this.formBuilder.group({
      Name: ["", [Validators.required]],
      Info: ["", [Validators.required]],
      Image: "",
      Time_Start: ["", [Validators.required]],
      Time_End: ["", [Validators.required]],
      Location_Latitude: "",
      Location_Longitude: "",
      Game_Question: this.formBuilder.array([
        this.initGameQuestion(),
      ]),
      MID: ["-1", [Validators.required]],
      FID: ["-1", [Validators.required]]
    });
  }

  initGameQuestion(){
    return this.formBuilder.group({
      Question: ["", [Validators.required]],
      Answer_Choice: this.formBuilder.array([
        this.initAnswerChoice(),this.initAnswerChoice(),this.initAnswerChoice(),this.initAnswerChoice(),
      ]),
      Right_Choice: ["", [Validators.required]]
    });
  }

  initAnswerChoice(){
    return this.formBuilder.group({
      Choice: ["", [Validators.required]],
    });
  }

  addGameQuestion() {
    const control = <FormArray>this.gameForm.controls["Game_Question"];
    control.push(this.initGameQuestion());
  }

  removeGameQuestion(i: number) {
    const control = <FormArray>this.gameForm.controls["Game_Question"];
    control.removeAt(i);
  }

  submitGame(){
    let confirm = this.alertCtrl.create({
      title: "Alert!",
      message: "Are you sure that you want to create this game?",
      buttons: [{
        text: "Disagree"
      },{
        text: "Agree",
        handler: () => {
         this.addGame();
        }
      }]
    });
    confirm.present();
  }

  addGame(){
    //get form data
    let game: Game = this.gameForm.value;
    
    //Change empty to NULL
    if(game.Image == ""){
      game.Image = null;
    }
    if(game.Location_Latitude == ""){
      game.Location_Latitude = null;
    }
    if(game.Location_Longitude == ""){
      game.Location_Longitude = null;
    }
    if(game.FID == "-1"){
      game.FID = null;
    }
    if(game.MID == "-1"){
      game.MID = null;
    }
    //*
    this.presentLoading();
    this.restApiProvider.addGame(game)
    .then(result => {
      this.loader.dismiss();
      console.log("add game success");
      var jsonData: any = result;
      if(jsonData.isSuccess){
        this.presentAlert(jsonData.message);
        //refresth list of game on the main game page
        this.navParams.get("parentPage").getListOfGames();
        this.navCtrl.pop();
      }
    })
    .catch(error =>{
      this.loader.dismiss();
      console.log("ERROR API : addGame",error);
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
    this.gameForm.patchValue({MID:"-1"});
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
      content: "Please wait..."
    });
    this.loader.present();
  }

}
