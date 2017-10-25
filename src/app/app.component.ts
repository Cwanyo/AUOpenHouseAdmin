import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Pages for staff and admin
import { LoginPage } from './../pages/login/login';
import { HomePage } from '../pages/home/home';
import { EventManagementPage } from './../pages/event-management/event-management';
import { GameManagementPage } from './../pages/game-management/game-management';

//Pages for admin only
import { AdminAccountManagementPage } from '../pages/admin-account-management/admin-account-management';
import { AdminAccountApprovalPage } from '../pages/admin-account-approval/admin-account-approval';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

  rootPage: any = LoginPage;

  constructor(
    public platform: Platform, 
    public menu: MenuController,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  goToHome(params){
    if (!params) params = {};
    this.navCtrl.setRoot(HomePage);
  }
  goToEventManagement(params){
    if (!params) params = {};
    this.navCtrl.setRoot(EventManagementPage);
  }
  goToGameManagement(params){
    if (!params) params = {};
    this.navCtrl.setRoot(GameManagementPage);
  }
  goToAccountManagement(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AdminAccountManagementPage);
  }
  goToAdminAccountApproval(params){
    if (!params) params = {};
    this.navCtrl.setRoot(AdminAccountApprovalPage);
  }
  
  logOut(){}
  
}
