import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'call-button',
  templateUrl: 'call-button.html'
})
export class CallButtonComponent {

  @Input() fullSize = false;
  EMERGENCY_NUMBER = '1234567890';
  SMS_MESSAGE = 'This is an emergency and I need your help. This is my location: https://www.google.com.mx/maps?q=';
  inCall = false;

  constructor(
    private storage: Storage,
    private sms: SMS,
    private geolocation: Geolocation,
    private callNumber: CallNumber
  ) { }

  call() {
    this.inCall = true;
    this.callEmergencyNumber();
  }

  textAndCall() {
    this.inCall = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.SMS_MESSAGE += resp.coords.latitude + ',' + resp.coords.longitude;
      let contacts = [];
      this.storage.get('ie-contact1').then((contact1) => {
        if (contact1 && contact1.phone && contact1.sms) {
          contacts.push(contact1.phone);
        }
        this.storage.get('ie-contact2').then((contact2) => {
          if (contact2 && contact2.phone && contact2.sms) {
            contacts.push(contact2.phone);
          }
          if (contacts && contacts.length > 0) {
            this.sms.send(contacts, this.SMS_MESSAGE)
              .then(smsResult => { this.callEmergencyNumber(); })
              .catch(error => { this.callEmergencyNumber(); });
          } else {
            this.callEmergencyNumber();
          }
        });
      });
    }).catch((error) => {
      this.inCall = false;
    });
  }

  callEmergencyNumber() {
    this.callNumber.callNumber(this.EMERGENCY_NUMBER, true)
      .then(() =>  { this.inCall = false; })
      .catch(() => { this.inCall = false; })
  }

}
