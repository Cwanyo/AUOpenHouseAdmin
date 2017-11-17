import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Platform } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { HomePage } from './../home/home';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menu: MenuController,
    private afAuth: AngularFireAuth,
    private platform: Platform 
  ) {
    //TODO - disable menu bar on login page
    this.menu.enable(false);
    this.userAuth();
  }

  userAuth(){
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.user = null;
        return;
      }
      this.user = user;
      //TODO - summit to backend /login
      this.user.getToken(true)
      .then(idToken => {
        console.log("idToken",idToken);
      })
      .catch(err => {
        console.log("ERROR : geting token",err);
      });
      //if account verify then Re-direct to Home
      this.menu.enable(true);
      this.navCtrl.setRoot(HomePage);
    });
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
        .catch(error => console.log("Error Sing-in with "+provider,error));
      });
    }else{
      this.afAuth.auth.signInWithPopup(signInProvider)
      .then(result => console.log("Logged-in with "+provider,result))
      .catch(error => console.log("Error Sing-in with "+provider,error));
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
