import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Contact } from '../../app/models.interface';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  contact1: Contact;
  contact2: Contact;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private modalCtrl: ModalController,
    private storage: Storage
  ) {}

  ionViewWillLoad() {
    this.storage.get('ie-contact1').then((contact) => {
      this.contact1 = contact;
    });
    this.storage.get('ie-contact2').then((contact) => {
      this.contact2 = contact;
    });
  }

  goToHomePage() {
    this.navCtrl.push('HomePage');
  }

  selectContact1() {
    let modal = this.modalCtrl.create('SelectContactPage');
    modal.onDidDismiss(selectedContact => {
      this.contact1 = {
        id: selectedContact.id,
        name: selectedContact.displayName,
        phone: selectedContact.phoneNumbers[0].value
      };
      this.storage.set('ie-contact1', this.contact1);
    });
    modal.present();
  }

  selectContact2() {
    let modal = this.modalCtrl.create('SelectContactPage');
    modal.onDidDismiss(selectedContact => {
      this.contact2 = {
        id: selectedContact.id,
        name: selectedContact.displayName,
        phone: selectedContact.phoneNumbers[0].value
      };
      this.storage.set('ie-contact2', this.contact2);
    });
    modal.present();
  }

  saveContact1() {
    this.storage.set('ie-contact1', this.contact1);
  }

  saveContact2() {
    this.storage.set('ie-contact2', this.contact2);
  }

}
