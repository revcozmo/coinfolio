import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,MenuController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { MyApp } from '../../app/app.component';
import { DatacoinProvider } from '../../providers/datacoin/datacoin';


// import firebase from 'firebase';

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
  loginForm: FormGroup;
  errorUsername: string = '';
  errorPassword: string = '';
  invalid:boolean;
  username: any;
  password: any;
  activeMenu:string;
  users: FirebaseListObservable<any[]>;
  // public users: firebase.database.Reference = firebase.database().ref('/users');
  arrayCheck: any[] = [];
  usersInFirebase : any[]=[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public angularfire: AngularFireDatabase,
    public alertCtrl: AlertController,
    public provider: DatacoinProvider,
    public menuControl:MenuController) {
    this.users = angularfire.list('/users');
    this.menuControl.swipeEnable(false);

    
    // this.users.subscribe(data => { this.usersInFirebase = data },
    //                      error => { console.log("error: " + error); },
    //                      () => { console.log('SHOW:'+this.usersInFirebase)} 
    //                     )

    // console.log('Length: '+this.usersInFirebase.length);
    // this.callArrayfromFirebase(this.arrayCheck);


    // this.users.on('value', itemSnapshot  => {
    //   this.arrayCheck = [];
    //   itemSnapshot.forEach(itemSnap => {
    //     this.users.push(itemSnap.val());
    //     return false;
    //   });
    // });
    // console.log('length: ' + this.arrayCheck.length);




    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  
  callArrayfromFirebase(mymy) {
    console.log('test')
    this.users.forEach(item => {
      mymy.push(item);
      console.log('shows: ' + this.arrayCheck.length);
    });
    return mymy;
  }

  validate(): boolean {
    this.errorUsername = '';
    this.errorPassword = '';

    if (this.loginForm.valid) {
      return true;
    }
    let controlUsername = this.loginForm.controls['username'];
    let controlPassword = this.loginForm.controls['password'];

    if (controlUsername.invalid) {
      if (controlUsername.errors['required']) {
        this.errorUsername = '*Username is a required field';
      }
    }

    if (controlPassword.invalid) {
      if (controlPassword.errors['required']) {
        this.errorPassword = '*Password is a required field';
      }
    }

    return false;
  }


  logIn(): void {
    console.log('CLick login :' + this.username + '/' + this.password)
    if (this.validate()) {
      console.log(this.loginForm.value);
      this.invalid = false;
      let alertComplete = this.alertCtrl.create({
        title: 'Login Succesful',
        subTitle: 'Your have been logged in! We hope your enjoy your time with CoinFolio'
      });

      let alertError = this.alertCtrl.create({
        title: 'Login Invalid',
        // subTitle: 'Your have been logged in! We hope your enjoy your time with CoinFolio'
      });

      this.arrayCheck = [];
      this.users.subscribe(item => {
        this.arrayCheck = item;
        console.log('shows Foreach: ' + this.arrayCheck.length);
        for (let i = 0; i < this.arrayCheck.length; i++) {
          console.log('>>>>>' + this.arrayCheck[i].username + '/' + this.arrayCheck[i].password)
          if (this.arrayCheck[i].username == this.username && this.arrayCheck[i].password == this.password) {
            this.provider.userKey = this.arrayCheck[i].$key;
            setTimeout(() => {
              alertComplete.present().then(() => {
                setTimeout(() => { 
                  alertComplete.dismiss();
                  this.provider.setUsername(this.username);
                  this.changeLoginMenuControl();
                  this.navCtrl.push(MyApp) 
                }, 1700);
              }).catch(() => {
                alertComplete.dismiss();
              });
            }, 0);
            break;
          }else {
            console.log('invalid')
            this.invalid=true
          
          }
        }
      });

    }
  }

  afterKeyUsername() {
    this.errorUsername = '';
  }
  afterKeyPassword() {
    this.errorPassword = '';
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  changeLoginMenuControl() {
    this.activeMenu = "login"
    this.menuControl.enable(true, this.activeMenu)
    this.menuControl.enable(false, 'notLogin');
  }

  changeLogoutMenuControl() {
    this.activeMenu = "notLogin"
    this.menuControl.enable(true, this.activeMenu)
    this.menuControl.enable(false, 'login');
  }
}
