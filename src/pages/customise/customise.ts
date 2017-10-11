import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ValuesFunctionsProvider} from "../../providers/values-functions/values-functions";
import {LoginPage} from "../login/login";
import firebase from 'firebase';

/**
 * Generated class for the CustomisePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customise',
  templateUrl: 'customise.html',
})
export class CustomisePage {
  style: any;
  key: any;
  user: any;
  amount: any;
  category: any;
  description: any;
  timestamp: string;
  categoryItem: string;
  submitButton: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public valuesFunctions: ValuesFunctionsProvider) {
    this.style = "style";
    this.key = navParams.get('key');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        if(this.key == null){
          this.key = firebase.database().ref(user.uid).push().key;
          this.submitButton = "Add";
          if (this.dst(new Date())) {
            this.timestamp = (new Date((new Date()).getTime()-3600000)).toISOString();
          }
          else {
            this.timestamp = (new Date()).toISOString();
          }
        }
        else {
          this.submitButton = "Update";
          const database = firebase.database().ref(user.uid + '/' + this.key);
          database.once('value').then(snapshot => {
            this.amount = (snapshot.val().amount);
            this.categoryItem = this.valuesFunctions.getTypeNames(snapshot.val().category);
            this.description = (snapshot.val().description);
            this.timestamp = (new Date(snapshot.val().timestamp)).toISOString();
          });
        }
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ionViewDidLoad() {
  }

  submit() {
    const database = firebase.database().ref(this.user.uid + '/' + this.key);
    database.set({
      category: this.valuesFunctions.getIndexFromName(this.categoryItem),
      amount: parseFloat(this.amount),
      description: this.description,
      timestamp: (new Date(this.timestamp)).getTime()
    }).then(() => {
      alert("Successfully " + this.submitButton);
      this.navCtrl.pop();
    }).catch(error => {
      alert(this.submitButton + " Function Error. /n" + error.message);
    });
  }

  stdTimezoneOffset(today: any) {
    let jan = new Date(today.getFullYear(), 0, 1);
    let jul = new Date(today.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }

  dst(today: any) {
    return today.getTimezoneOffset() < this.stdTimezoneOffset(today);
  }
}
