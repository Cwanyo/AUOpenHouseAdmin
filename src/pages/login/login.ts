import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, AlertController  } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { HomePage } from './../home/home';

import { RestApiProvider } from './../../providers/rest-api/rest-api';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private user: firebase.User;
  private userCheck: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menu: MenuController,
    private afAuth: AngularFireAuth,
    private restApiProvider: RestApiProvider,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {
    //TODO - disable menu bar on login page
    this.menu.enable(false);
  }

  userAuth(){
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.user = null;
        return;
      }
      this.user = user;
      if(!this.userCheck){
        this.userCheck = true;
        this.summitBackend();
      }
    });
  }

  summitBackend(){
    //TODO - summit to backend /login
    this.user.getToken(true)
    .then(idToken => {
      this.restApiProvider.login(idToken)
      .then(data => {
        var jsonData: any = data;
        if(jsonData.isSuccess){
          //if account verify then Re-direct to Home
          this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
        }
      }).catch(error => {
        var jsonData = JSON.parse(error.error);
        //show error message
        this.presentAlert(jsonData.message);
      });
    
    })
    .catch(err => {
      console.log("ERROR : geting token",err);
    });
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: message,
      buttons: [{
        text: 'Logout',
        handler: () => {
          this.logout();
        }
      }]
    });
    alert.present();
  }

  login(provider){

    let signInProvider = null;

    switch (provider) {
      case "facebook":
        signInProvider = new firebase.auth.FacebookAuthProvider();
        break;
      case "google":
        signInProvider = new firebase.auth.GoogleAuthProvider();
        break;
    }

    if (this.platform.is('cordova')){
      this.afAuth.auth.signInWithRedirect(signInProvider)
      .then(() => {
        this.afAuth.auth.getRedirectResult()
        .then(result => console.log("Logged-in with "+provider,result))
        .then(() => this.userAuth())
        .catch(error => console.log("Error Sing-in with "+provider,error));
      });
    }else{
      this.afAuth.auth.signInWithPopup(signInProvider)
      .then(result => console.log("Logged-in with "+provider,result))
      .then(() => this.userAuth())
      .catch(error => console.log("Error Sing-in with "+provider,error));
    }

  }

  logout() {
    this.afAuth.auth.signOut()
    .then(result => console.log("Sign-out",result))
    .catch(error => console.log("Error Sing-out",error));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
