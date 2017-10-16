import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { Geolocation } from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {

  contact1: any;
  contact2: any;
  SMS_MESSAGE = 'This is an emergency and I need your help. This is my location: https://www.google.com.mx/maps?q=';
  inCall = false;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public alertCtrl: AlertController,
    private sms: SMS,
    private geolocation: Geolocation,
    private callNumber: CallNumber
  ) { }

  ionViewWillLoad() {
    this.storage.get('ie-contact1').then((contact) => {
      this.contact1 = contact;
    });
    this.storage.get('ie-contact2').then((contact) => {
      this.contact2 = contact;
    });
  }

  goToProfilePage() {
    let alert = this.alertCtrl.create({
      title: 'ALERT',
      subTitle: 'Are you sure you want to continue?',
      buttons: [
        {
          text: 'CANCEL'
        },
        {
          text: 'CONTINUE',
          handler: data => {
            this.navCtrl.push('ProfilePage');
          }
        }
      ]
    });
    alert.present();
  }

  goToContactsPage() {
    this.navCtrl.push('ContactsPage');
  }


  callContactNumber(number, sms) {
    this.inCall = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.SMS_MESSAGE += resp.coords.latitude + ',' + resp.coords.longitude;
      let contacts = [];

      contacts.push(number);

      if (contacts && contacts.length > 0) {
        this.sms.send(contacts, this.SMS_MESSAGE)
          .then(smsResult => { this.callEmergencyNumber(number); })
          .catch(error => { this.callEmergencyNumber(number); });
      } else {
        this.callEmergencyNumber(number);
      }

    }).catch((error) => {
      this.inCall = false;
    });
  }

  callEmergencyNumber(number) {
    this.callNumber.callNumber(number, true)
      .then(() => { this.inCall = false; })
      .catch(() => { this.inCall = false; })
  }

}
