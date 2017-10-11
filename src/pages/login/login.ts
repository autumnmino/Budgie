import { Component } from '@angular/core';
import {AlertController, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import firebase from "firebase";
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {EmailValidator} from "../login/email";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  form: FormGroup;
  public loading:Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.form = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
        EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.navCtrl.setRoot(HomePage);
      }
    });
  }

  login() {
    if (this.form.controls.email.valid && this.form.controls.password.valid) {
      firebase.auth().signInWithEmailAndPassword(this.form.value.email, this.form.value.password).then(user => {
        this.loading.dismiss();
        alert("Welcome back to Budgie!");
        this.navCtrl.setRoot(HomePage);
      }).catch(error => {
        const errorAlert = this.alertCtrl.create({
          title: 'Problems Login',
          message: error.message,
          buttons: [
            {
              text: 'Retry',
              role: 'cancel'
            },
            {
              text: 'Forget',
              handler: () => {
                const forgotAlert = this.alertCtrl.create({
                  title: 'Reset Password',
                  message: 'Enter your Email to reset password',
                  inputs: [
                    {
                      name: 'email',
                      placeholder: 'Email'
                    }
                  ],
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel'
                    },
                    {
                      text: 'Reset',
                      handler: data => {
                        firebase.auth().sendPasswordResetEmail(data.email).then(function() {
                          alert("Email Sent.");
                        }).catch(function(error) {
                          alert(error.message);
                        });
                      }
                    }
                  ]
                });
                forgotAlert.present();
              }
            }
          ]
        });
        this.loading.dismiss();
        errorAlert.present();
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
    else {
      alert("Please enter valid Email and Password.");
    }
  }

  register() {
    if (this.form.controls.email.valid && this.form.controls.password.valid) {
      firebase.auth().createUserWithEmailAndPassword(this.form.value.email, this.form.value.password).then(user => {
        user.sendEmailVerification();
        this.loading.dismiss();
        alert("Welcome to Budgie!");
        this.navCtrl.setRoot(HomePage);
      }).catch(error => {
        alert(error.message);
        this.loading.dismiss();
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
    else {
      alert("Please enter valid Email and Password.");
    }
  }

}
