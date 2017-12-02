import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HomePage } from '../home/home';
import { DatacoinProvider } from '../../providers/datacoin/datacoin';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
/**
 * Generated class for the EditTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-transaction',
  templateUrl: 'edit-transaction.html',
})
export class EditTransactionPage {
  
  

  myDate: String = new Date().toISOString();



  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public builder: FormBuilder,
    public viewCtrl: ViewController,
    public provider: DatacoinProvider,
    public angularfire: AngularFireDatabase
        ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTransationPage');
  }
  getStatusDate(){
    console.log(this.myDate);
  }
  
}
