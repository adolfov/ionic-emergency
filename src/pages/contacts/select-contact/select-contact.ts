import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { Contacts, Contact, ContactFindOptions } from '@ionic-native/contacts';
import * as _ from 'underscore';

@IonicPage()
@Component({
  selector: 'page-select-contact',
  templateUrl: 'select-contact.html',
})
export class SelectContactPage {

  contactList: Contact[];
  contactFilteredList = [] as Contact[];
  searching = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private contacts: Contacts, 
    public loading: LoadingController, 
    private sanitizer: DomSanitizer, 
    private viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.loadContacts();
  }

  loadContacts() {
    let loader = this.loading.create({
      content: 'Loading ...',
    });

    loader.present().then(() => {
      var options = new ContactFindOptions();
      options.multiple = true;
      options.desiredFields = ['id', 'displayName', 'phoneNumbers', 'photos'];
      options.hasPhoneNumber = true;

      this.contacts.find(['id'], options).then((contacts) => {
        var sortedContacts = _.sortBy(contacts, 'displayName');
        this.contactList = this.contactFilteredList = sortedContacts;
        loader.dismiss();
      }).catch((error) => {
        console.error(error);
        loader.dismiss();
      });
    });
  }

  filterContacts(filter) {
    if (filter) {
      this.contactFilteredList = _.filter(this.contactList, function(contact: Contact) {
        let filterString =  filter.target.value.toLowerCase();
        return contact.displayName.toLowerCase().includes(filterString);
      });
    }
  }

  displayAlert(contact: Contact) {
    let alert = this.alertCtrl.create({
      title: 'Choose phone',
      subTitle: 'Choose the phone number you would like to use',
      buttons: [
        {
          text: 'CANCEL'
        },
        {
          text: 'CONTINUE',
          handler: data => {
            contact.phoneNumbers[0].value = data;
            this.viewCtrl.dismiss(contact);
          }
        }
      ]
    });
    contact.phoneNumbers.forEach((phone, index) => {
      alert.addInput({type: 'radio', label: phone.value, value: phone.value, checked: index==0});
    });
    alert.present();
  }

  contactSelected(contact: Contact) {
    if (contact.phoneNumbers.length > 1) {
      this.displayAlert(contact);
    } else {
      this.viewCtrl.dismiss(contact);    
    }
  }

  goToContactsPage() {
    this.navCtrl.push('ContactsPage');
  }

  getPhotoSrc(contact: Contact) {
    if (contact.photos && contact.photos[0]) {
      return this.sanitizer.bypassSecurityTrustUrl(contact.photos[0].value);
    } else {
      return 'assets/contact.png';
    }
  }

}
