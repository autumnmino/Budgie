import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

import { ValuesFunctionsProvider } from '../../providers/values-functions/values-functions';
import {LoginPage} from "../login/login";
import {CustomisePage} from "../customise/customise";

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  public kind;
  types = [];
  dates = [];
  descs = [];
  amounts = [];
  items = [];
  keys = [];
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public valuesFunctions: ValuesFunctionsProvider) {
    this.kind = navParams.get('kind');
    this.items = valuesFunctions.items;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.navCtrl.push(LoginPage);
      }
    });
  }

  ionViewDidLoad() {
    const database = firebase.database().ref(this.user.uid);
    const currentTime = new Date();
    const timeNow = currentTime.getTime();
    const today = (currentTime).setHours(0, 0, 0, 0);
    const weekBefore = (new Date(timeNow - 518400000)).setHours(0, 0, 0, 0);

    if (this.kind == 'day') {
      database.orderByChild("timestamp").startAt(today).endAt(timeNow).on('value', snapshot => {
        this.clear();
        snapshot.forEach(childSnapshot => {
          this.types.push(childSnapshot.val().category);
          this.dates.push(this.valuesFunctions.convertToDateTime(childSnapshot.val().timestamp));
          this.descs.push(childSnapshot.val().description);
          this.amounts.push(childSnapshot.val().amount);
          this.keys.push(childSnapshot.key);

          return false;
        });
      });
    }
    else if (this.kind == 'week') {
      database.orderByChild("timestamp").startAt(weekBefore).endAt(timeNow).on('value', snapshot => {
        this.clear();
        snapshot.forEach(childSnapshot => {
          this.types.push(childSnapshot.val().category);
          this.dates.push(this.valuesFunctions.convertToDateTime(childSnapshot.val().timestamp));
          this.descs.push(childSnapshot.val().description);
          this.amounts.push(childSnapshot.val().amount);
          this.keys.push(childSnapshot.key);

          return false;
        });
      });
    }
    else if (this.kind == 'all') {
      database.orderByChild("timestamp").on('value', snapshot => {
        this.clear();
        snapshot.forEach(childSnapshot => {
          this.types.push(childSnapshot.val().category);
          this.dates.push(this.valuesFunctions.convertToDateTime(childSnapshot.val().timestamp));
          this.descs.push(childSnapshot.val().description);
          this.amounts.push(childSnapshot.val().amount);
          this.keys.push(childSnapshot.key);

          return false;
        });
      });
    }
  }

  delete(index: any) {
    const database = firebase.database().ref(this.user.uid);
    database.child(this.keys[index]).remove(error => {
      if (error) {
        alert("Deleting Error." + error);
      }
      else {
        this.types = [];
        this.dates = [];
        this.descs = [];
        this.amounts = [];
        this.keys = [];
      }
    });
  }

  edit(index: number) {
    this.navCtrl.push(CustomisePage, {
      key: this.keys[index],
    });
  }

  clear() {
    this.types = [];
    this.dates = [];
    this.descs = [];
    this.amounts = [];
    this.keys = [];
  }
}
