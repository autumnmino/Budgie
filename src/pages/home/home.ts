import { Component, ViewChild } from '@angular/core';
import {NavController, AlertController, FabContainer } from 'ionic-angular';
import { Chart } from 'chart.js';
import firebase from 'firebase';

import { DetailsPage } from '../details/details';
import { ValuesFunctionsProvider } from '../../providers/values-functions/values-functions';
import {LoginPage} from "../login/login";
import {CustomisePage} from "../customise/customise";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  lineChart: any;
  doughnutChart: any;
  todayTotal: any;
  wSpent: any;
  wTypes = [];
  wHistory: any;
  wLabels: any;
  items = [];
  colors = [];
  user: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public valuesFunctions: ValuesFunctionsProvider) {
    this.items = valuesFunctions.items;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  ionViewDidLoad() {
    const database = firebase.database().ref(this.user.uid);
    const currentTime = new Date();
    const timeNow = currentTime.getTime();
    const today = (currentTime).setHours(0, 0, 0, 0);
    const weekBefore = (new Date(timeNow - 518400000)).setHours(0, 0, 0, 0);
    let total = 0;
    let data = [];
    let types = [];
    let dates = [];
    let daystotal = [];

    database.orderByChild("timestamp").startAt(today).endAt(timeNow).on('value', snapshot => {
      total = 0;
      snapshot.forEach(childSnapshot => {
        total += childSnapshot.val().amount;

        return false;
      });
      this.todayTotal = total.toFixed(2);
    });

    database.orderByChild("timestamp").startAt(weekBefore).endAt(timeNow).on('value', snapshot => {
      data = [];
      types = [];
      dates = [];
      daystotal = [];
      snapshot.forEach(childSnapshot => {
        let typeNum = childSnapshot.val().category;
        let timestamp = childSnapshot.val().timestamp;
        let stampDate = new Date((this.valuesFunctions.convertToDateTime(timestamp)).setHours(0, 0, 0, 0)).getDay();
        let dateIndex = 0;
        let addDate = true;
        let addType = true;
        let typeIndex = 0;
        if (types.length == 0) {
          types.push(typeNum);
          data.push(childSnapshot.val().amount);
        }
        else {
          let i = 0;
          for (const type of types){
            if (type == typeNum) {
              addType = false;
              typeIndex = i;
            }
            i++;
          }
          if (addType) {
            types.push(typeNum);
            data.push(childSnapshot.val().amount);
          }
          else {
            data[typeIndex] += childSnapshot.val().amount;
          }
        }

        if (dates.length == 0) {
          dates.push(this.valuesFunctions.days[stampDate]);
          daystotal.push(childSnapshot.val().amount);
        }
        else {
          let i = 0;
          for (const date of dates){
            if (date == this.valuesFunctions.days[stampDate]) {
              addDate = false;
              dateIndex = i;
            }
            i++;
          }
          if (addDate) {
            dates.push(this.valuesFunctions.days[stampDate]);
            daystotal.push(childSnapshot.val().amount);
          }
          else {
            daystotal[dateIndex] += childSnapshot.val().amount;
          }
        }
        return false;
      });
      this.wSpent = data;
      this.wHistory = daystotal;
      this.wLabels = dates;
      for (const type of types){
        this.wTypes.push(this.valuesFunctions.getTypeNames(type));
        this.colors.push(this.valuesFunctions.itemscolors[type]);
      }
      this.updateUI();
    });
  }

  addSpend(type, fab: FabContainer) {
    let prompt = this.alertCtrl.create({
      title: "Add " + this.valuesFunctions.getTypeNames(type) + "Spend",
      inputs: [
        {
          name: 'amount',
          placeholder: 'Amount $$',
          type: 'number'
        },
        {
          name: 'description',
          placeholder: 'Descriptions'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            const timeNow = firebase.database.ServerValue.TIMESTAMP;
            let database = firebase.database();

            database.ref(this.user.uid).push({
              category: type,
              amount: parseFloat(data.amount),
              description: data.description,
              timestamp: timeNow
            }, error => {
              if (error) {
                alert("Data could not be saved." + error);
              } else {
                alert("Data saved successfully.");
                this.navCtrl.setRoot(HomePage);
              }
            });
          }
        }
      ]
    });

    fab.close();
    prompt.present();
  }

  updateUI() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: this.wSpent,
          backgroundColor: this.colors,
          borderColor: '#ffffff',
          borderWidth: 5
        }],
        labels: this.wTypes
      }
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.wLabels,
        datasets: [{
          label: "Spends",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 7,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.wHistory,
          spanGaps: false,
        }],
        options: {
          events: ['click'],
          onClick: which => {
            this.viewDetails(which);
          }
        }
      },
    });
  }

  viewDetails(kind: string) {
    this.navCtrl.push(DetailsPage, {
      kind: kind,
    });
  }

  logOut() {
    const alert = this.alertCtrl.create({
      title: 'Logging Out',
      message: 'You are about to Log Out.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Log Out',
          handler: () => {
            firebase.auth().signOut().then(function() {
              this.navCtrl.setRoot(LoginPage);
            });
          }
        }
      ]
    });
    alert.present();
  }

  customise() {
    this.navCtrl.push(CustomisePage);
  }
}
