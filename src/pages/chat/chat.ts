import { Component, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DatacoinProvider } from '../../providers/datacoin/datacoin';

// import { Content } from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html',
})
export class ChatPage {
	// @ViewChild(Content) content: Content;
	@ViewChild('scrollMe') private myScrollContainer: ElementRef;
	chatTime: Date = new Date();
	chatting: chatting[];
	chattingNew: chatting[];
	username: string;
	message: string;
	userLogin: boolean;
	// messages: string;
	errorMessage: string = '';
	sendMessage: FormGroup;
	date: Date = new Date();
	pages: any[];
	chats: FirebaseListObservable<any[]>;
	chatsList: any[] = [];
	MAX_NUMBER =100;


	constructor(public builder: FormBuilder,
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public menu: MenuController,
		public angularfire: AngularFireDatabase,
		public provider: DatacoinProvider
		, ) {
		this.chats = angularfire.list('/chats');
		this.chats.subscribe(data => {
			let list = data;
			if (list.length > 4) {
				for (let i = 0; i < list.length - this.MAX_NUMBER; i++) {
					this.chats.remove(list[i].$key);
				}
			}
		})

		// this.chats.update('-L-If9h5MDj5iaTTwa_Z', { date: 'Fir Dec 01 2017' })
		// this.chats.update('-L-IfCLWC7uicu-psggG', { date: 'Fir Dec 01 2017' })
		// this.chats.subscribe(data => {
		// 	let list = data;
		// 	console.log('length Constur ' + list.length)
		// 	if(list.length > 4){
		// 		for (let i = list.length-1 ; this.chatsList.length < 5;i--){
		// 		console.log('i = '+i)
		// 		this.chatsList.unshift(list[i])
		// 		// if(data[i].date != this.date.toDateString()){
		// 		// 	this.chats.remove(data[i].$key);
		// 		// }
		// 	}
		// 	} else {
		// 		this.chatsList = list;
		// 	}

		// 	console.log(this.chatsList.length);
		// })




		this.provider.getUsername().then((item) => {
			if (item) {
				this.username = item;
				this.userLogin = true;
			} else {
				let random = Math.floor(Math.random() * (9999 - 1000) + 1000);
				this.username = 'User' + random;
			}
		});

		this.pages = ['Home', 'List'];
		menu.enable(true);
		this.sendMessage = this.builder.group({
			'message': ['', Validators.required]
		});

		// this.chatting = [{username:'Sommestake',message:'LOL and merchants revenue also counts, what a scam'}
		// 				 	]
		// this.chattingNew = [{username:'Glorious King',message:'COSS is beating all odds'},
		// 				 {username:'tek-gsm',message:'Gece 4650 den aldım'},
		// 				 {username:'Glorious King',message:'75000 coss'},
		// 				 {username:'mathtaro76',message:'monacoin is very popular with Japanese people. The Japanese group will carry out strategies to raise monacoin prices soon. If you buy it is out of now.'},
		// 				 {username:'tobiblue',message:'whats wrong with the website ?'},
		// 				 {username:'sexyman',message:'COSS is the most underrated/underpriced crypto out there by a huge margin'},
		// 				 {username:'tobiblue',message:'everything is working fine'},
		// 				 {username:'tek-gsm',message:'@EhvFlyest, satışa 5500 koyup deneyim o zaman çünkü arada baya para fark ediyor'},
		// 				 {username:'Glorious King',message:'Awesome next level COSS. I saw it happen and again it would. I love you COSS'},
		// 				 {username:'everynevah',message:'why would coss moon today?'},
		// 				 {username:'wolke',message:'neo and ripple are mooning today'},
		// 				 {username:'sexyman',message:' @everynevah, COSS could moon at anytime because its underpriced'},
		// 				 {username:'jonathan12345678',message:'BET in talks w/ NEO & platform release is ahead of schedule.'},
		// 				 {username:'Glorious King',message:'75000 COSS'},
		// 				 {username:'drumcrazy72',message:'@hit123456, Cool, and their Price fields dont update when you change trading pairs, so they need to fix that. Or someones gonna sell their holdings for pennies :)'},
		// 				 {username:'EhvFlyest',message:'@tek-gsm, Bende yaptim, satis yaparsan super olur aksam uzeri olmassi lazim'},
		// 				 {username:'Saracen',message:'@ididit, COSS will be listed in more exchanges in this Month of October'},
		// 				 {username:'sexyman',message:'@everynevah, almost all alts are vaporware bullshit that offer nothing, even long term. COSS has an exchange up and running already'},
		// 				 {username:'akinator84',message:'OMG COSS !'},
		// 				 {username:'nbhp1505',message:'@Glorious King, COSS 100$ very soon lol'},
		// 				 {username:'akinator84',message:'and coss marketcap is only 4M US'}]
	}

	ngAfterViewChecked() {
		this.myScrollContainer.nativeElement.scrollTop =
			this.myScrollContainer.nativeElement.scrollHeight;
	}

	// ionViewDidLoad() {
	// 	console.log('ionViewDidLoad ChatPage');
	// 	this.autoChatting();
	// 	// this.content.scrollDownOnLoad = true
	// 	// setTimeout(() => {
	// 	// 	this.content.scrollToBottom();
	// 	// }, 100);
	// 	//	this.content.scrollToBottom(300);//300ms animation speed
	// }

	// addChatting(username:string,message:any){
	// 		console.log('Message : '+message.message);
	// 		this.chatting.push({username:username,message:message.message});
	// 		console.log('addChatting');
	// 		this.message = '';

	// }

	// 	autoChatting(){
	// 		console.log('length : '+this.chattingNew.length);
	// 		// for(let i =0;i<this.chattingNew.length;i++){
	// 		// 	setTimeout(()=> {
	// 		// 		this.chatting.push(this.chattingNew[i])
	// 		// 	}, 2500);
	// 		// }
	// 	(function fn(n,oldChat,chatArray) {
	//   		console.log('Username :'+chatArray[n].username);
	//   		oldChat.push({username:chatArray[n].username,message:chatArray[n].message});
	//   		if (n < chatArray.length-1) setTimeout(function() { fn(++n,oldChat,chatArray);}, 2000);
	// 	}(0,this.chatting,this.chattingNew));
	// }

	editUsername() {
		let prompt = this.alertCtrl.create({
			title: 'Edit Username',
			message: "Enter a new username for chatting!",
			inputs: [
				{
					name: 'newUsername',
					placeholder: 'Your Username'
				},
			],
			buttons: [
				{
					text: 'Cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Save',
					handler: data => {
						console.log('Saved clicked');
						if (data.newUsername) {
							this.username = data.newUsername;
						}
					}
				}
			]
		});

		prompt.present();
	}


	validate(): any {
		let errorMsg: string;
		if (this.sendMessage.valid) {
			return true;
		}

		let controlMsg = this.sendMessage.controls['message'];
		if (controlMsg.invalid) {
			if (controlMsg.errors['required']) {
				errorMsg = 'Please provide a message.';
			}
		}

		this.errorMessage = errorMsg;
		return false;
	}

	saveMsg() {
		this.errorMessage = '';
		if (this.validate()) {
			// let msgDetail = this.sendMessage.value ;
			this.message = this.sendMessage.value.message;
			// this.addChatting(this.username,msgDetail);

			console.log("message : " + this.message)
			console.log("date: " + this.date.toDateString())
			let chatTemp = {
				messages: this.message,
				username: this.username,
				date: this.date.toDateString()
			}
			this.chats.push(chatTemp);
			this.chats.subscribe(data => {
				let list = data;
				console.log('length Constur ' + list.length)
				if (list.length > 4) {
					for (let i = 0; i < list.length - this.MAX_NUMBER;i++){
						this.chats.remove(list[i].$key);
					}
				}
			})
			
			this.message = '';
		} else {
			this.errorMessage = 'Please provide a message.';
			console.log(this.errorMessage)
		}
	}

}




export class chatting {

	username: string;
	message: string;
}