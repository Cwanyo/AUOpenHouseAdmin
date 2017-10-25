import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

//Pages for staff and admin
import { LoginPage } from './../pages/login/login';
import { HomePage } from '../pages/home/home';
import { EventManagementPage } from './../pages/event-management/event-management';
import { GameManagementPage } from './../pages/game-management/game-management';

//Pages for admin only
import { AdminAccountManagementPage } from '../pages/admin-account-management/admin-account-management';
import { AdminAccountApprovalPage } from '../pages/admin-account-approval/admin-account-approval';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    EventManagementPage,
    GameManagementPage,
    AdminAccountManagementPage,
    AdminAccountApprovalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    EventManagementPage,
    GameManagementPage,
    AdminAccountManagementPage,
    AdminAccountApprovalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
