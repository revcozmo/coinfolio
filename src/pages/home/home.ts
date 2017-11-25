import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ItemSliding, ModalController } from 'ionic-angular';
import { DatacoinProvider, cryptoNumbers, cryto, asks, bids, NAME, crytoMix } from '../../providers/datacoin/datacoin';
import { Content } from 'ionic-angular';
import { CoinsDetailPage } from '../coins-detail/coins-detail';
import { AddTransationPage } from '../add-transation/add-transation';
import { MyApp } from '../../app/app.component';
import { EditTransactionPage } from '../edit-transaction/edit-transaction';
import { Screenshot } from '@ionic-native/screenshot';
// import { SocialSharing } from '@ionic-native/social-sharing';
// import { Storage } from '@ionic/storage';

import { Storage } from '@ionic/storage';
// import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { LoadingController } from 'ionic-angular';


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content
  // crytoName: any[] = NAME;
  cryptoNumbers: cryto[] = [];
  cryptoMix: crytoMix[] = [];
  cryptoTotal: crytoMix[] = [];
  segment = 'THB';
  rateBtc: any = 0; // 1 BTC = 247900 THB
  rateEth: any = 0; // 1 ETC = 10600 THB
  rateUsd: any = 0; // 1 USD = 34 THB
  coins: crytoMix[] = [];
  username: any;
  myApp: MyApp;
  loader:any
  // ETH: crytoMix[]=[];
  // USD: crytoMix[] = [];
  // THB: crytoMix[] = [];
  // BTC: crytoMix[] = [];
  screen: any;
  state: boolean = false;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provider: DatacoinProvider,
    public modalCtrl: ModalController,
    public storage: Storage,
    private screenshot: Screenshot,
) {

    this.mixNameCoins();
    this.username='';
    this.storage.ready().then(() => {
      this.provider.getUsername().then((data) => {
        this.username = data
        console.log('constructor: ' + this.username)
        this.content.resize();
      });
    });
    console.log('Home Constructor');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  mixNameCoins() {
    this.provider.loadBX().subscribe(data => {
      this.cryptoNumbers = Object.keys(data).map(key => data[key]);
      // this.loader.dismiss();
      // console.dir(this.cryptoNumbers)
    },
      error => { console.log("error: " + error); },
      () => {
        this.provider.addName(this.cryptoMix, this.cryptoNumbers);

        this.rateUsd = 34;
        for (let i = 0; i < this.cryptoMix.length; i++) {
          if (this.cryptoMix[i].secondary_currency == 'BTC') {
            this.rateBtc = this.cryptoMix[i].last_price;
            this.provider.rateBtc = this.rateBtc;
            // console.log('price ' + this.cryptoMix[i].secondary_currency + ' ' + this.rateBtc);
          }
          if (this.cryptoMix[i].secondary_currency == 'ETH' && this.cryptoMix[i].primary_currency == 'THB') {
            this.rateEth = this.cryptoMix[i].last_price;
            this.provider.rateEth = this.rateEth;
            // console.log('ETH:price ' + this.cryptoMix[i].secondary_currency + ' ' + this.rateEth);
          }
        }
        // console.log("Read park completely");

        this.loopOfConvert('THB');
        this.loopOfConvert('BTC');
        this.loopOfConvert('ETH');
        this.loopOfConvert('USD');
        this.changeMarket(this.segment)
        // console.dir(this.cryptoNumbers[0].orderbook.asks.highbid)
      })
  }

  
  reset() {
    var self = this;
    setTimeout(function () {
      self.state = false;
    }, 1000);
  }

  screenShot() {
    this.screenshot.save('jpg', 80).then(res => {
      this.screen = res.filePath;
      this.state = true;
      this.reset();
    });
  }





  loopOfConvert(type) {
    for (let i = 0; i < this.cryptoMix.length; i++) {
      this.pushCrytoTotal(type, i);
    }
    console.log(`${type} length : ${this.cryptoTotal.length}`)
  }

  pushCrytoTotal(type: any, index: number) {
    let lastIndex = this.cryptoTotal.length - 1;
    this.cryptoTotal.push({
      pairing_id: this.cryptoMix[index].pairing_id,
      primary_currency: type,
      secondary_currency: this.cryptoMix[index].secondary_currency,
      change: this.cryptoMix[index].change,
      last_price: this.convertMoney(this.cryptoMix[index], type),
      volume_24hours: this.cryptoMix[index].volume_24hours,
      nameCrypto: this.cryptoMix[index].nameCrypto,
      orderbook: this.cryptoMix[index].orderbook
    })
    // console.log(`[${index}] push: ${this.cryptoTotal[lastIndex + 1].secondary_currency}/${this.cryptoTotal[lastIndex + 1].primary_currency} price: ${this.cryptoTotal[lastIndex + 1].last_price}`);
  }

  convertMoney(coin, type) {
    let price = 0;
    let priceDecimal;
    if (coin.primary_currency == 'THB') { // แปลงจากเงินบาท
      if (type == 'THB') {
        price = coin.last_price;
      } else if (type == 'BTC') {
        price = (coin.last_price / this.rateBtc);
        // console.log(`BTC>>> ${price}`)
      } else if (type == 'ETH') {
        price = (coin.last_price / this.rateEth);
      } else if (type == 'USD') {
        price = (coin.last_price / this.rateUsd);
      }
    } else if (coin.primary_currency == 'BTC') { // แปลงจากเงิน BTC
      if (type == 'THB') {
        price = (coin.last_price * this.rateBtc);
      } else if (type == 'BTC') {
        price = coin.last_price;
        // console.log(`${coin.secondary_currency}/BTC>>> ${price}`)
      } else if (type == 'ETH') {
        price = ((coin.last_price * this.rateBtc) / this.rateEth);
      } else if (type == 'USD') {
        price = ((coin.last_price * this.rateBtc) / this.rateUsd);
      }
    }

    if (price < 1) {
      priceDecimal = price.toFixed(8);
    } else {
      priceDecimal = price.toFixed(2);
    }
    return priceDecimal;
  }


  changeMarket(type) {
    this.content.scrollToTop(300);
    this.segment = type;
    if (this.cryptoTotal.length > -1) {
      let filtered = this.cryptoTotal.filter(row => {
        if (row.primary_currency == type) {
          return true;
        } else {
          return false;
        }
      });
      this.coins = filtered;
    } else {
      console.log('No data');
    }
  }

  addTransaction(slidingItem: ItemSliding, crypto: any): void {
    let modal = this.modalCtrl.create(AddTransationPage, crypto);
    // let modal2 = this.modalCtrl.create(EditTransactionPage, crypto);
    modal.present();
    slidingItem.close();
  }

  ngOnInit() {
    // this.provider.getUsername().then((item)=>{
    //   this.username = item;
    // });
    this.username = this.provider.getUsername()
    console.log('Home::' + this.username);
  }

  goToDetail(crypto) {
    console.log('nextPage:' + crypto.orderbook.asks.highbid)
    this.navCtrl.setRoot(CoinsDetailPage, crypto);
    // this.navCtrl.push(CoinsDetailPage,crypto);
    
  }
  
}
