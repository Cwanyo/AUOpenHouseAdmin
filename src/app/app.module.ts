import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Pages for staff and admin
import { LoginPage } from './../pages/login/login';
import { HomePage } from '../pages/home/home';
import { EventManagementPage } from './../pages/event-management/event-management';
import { CreateEventPage } from '../pages/create-event/create-event';
import { EditEventPage } from './../pages/edit-event/edit-event';
import { ViewEventPage } from './../pages/view-event/view-event';
import { GameManagementPage } from './../pages/game-management/game-management';

import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';

//RESTAPI
import { RestApiProvider } from '../providers/rest-api/rest-api';

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
    CreateEventPage,
    EditEventPage,
    ViewEventPage,
    GameManagementPage,
    AdminAccountManagementPage,
    AdminAccountApprovalPage
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    EventManagementPage,
    CreateEventPage,
    EditEventPage,
    ViewEventPage,
    GameManagementPage,
    AdminAccountManagementPage,
    AdminAccountApprovalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    RestApiProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
