import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import firebase from 'firebase';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DetailsPage } from '../pages/details/details';
import { ValuesFunctionsProvider } from '../providers/values-functions/values-functions';
import { LoginPage } from "../pages/login/login";
import { CustomisePage } from "../pages/customise/customise";

var config = {
  apiKey: "AIzaSyBHqmU8hfQK5imYxKlasLCI2bTWTXKegk4",
  authDomain: "budgie-c64d4.firebaseapp.com",
  databaseURL: "https://budgie-c64d4.firebaseio.com",
  projectId: "budgie-c64d4",
  storageBucket: "",
  messagingSenderId: "454886899125"

};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailsPage,
    LoginPage,
    CustomisePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailsPage,
    LoginPage,
    CustomisePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Toast,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ValuesFunctionsProvider
  ]
})

export class AppModule {}
