import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Profile } from '../../app/models.interface';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profileForm: FormGroup;
  profile: Profile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: ApiProvider,
    public loading: LoadingController,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.storage.get('ie-profile').then((profile) => {
      if (!profile) {
        profile = {};
      }
      this.profile = profile;
      this.profileForm = this.formBuilder.group({
        name: [profile.name, Validators.compose([Validators.required, this.NoWhitespaceValidator])],
        lastname: [profile.lastname, Validators.compose([Validators.required, this.NoWhitespaceValidator])],
        phone: [profile.phone, Validators.compose([Validators.required, this.NoWhitespaceValidator])],
        email: [profile.email, Validators.compose([Validators.required, Validators.email])]
      });
    });
  }

  saveProfile() {
    if (!this.profileForm.controls.name.valid) {
      this.presentToast('Type your name');
    } else if (!this.profileForm.controls.lastname.valid) {
      this.presentToast('Type your lastname');
    } else if (!this.profileForm.controls.phone.valid) {
      this.presentToast('Type your phone number');
    } else if (this.profileForm.value.email.length < 1) {
      this.presentToast('Type your email');
    } else if (!this.profileForm.controls.email.valid) {
      this.presentToast('The email address is not valid');
    } else {
      this.profile = this.profileForm.value;
      let loader = this.loading.create({
        content: 'Saving ...'
      });

      loader.present().then(() => {
        this.apiProvider.saveProfile(this.profile).then(profile => {
          this.storage.set('ie-profile', this.profile);
          loader.dismiss();
          this.showAlert('', 'Your profile information has been saved.')
        }).catch(error => {
          loader.dismiss();
          this.showAlert('', 'There was an error saving your information. Contact us.')
        });
      });
    }
  }

  presentToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  goToHomePage() {
    this.navCtrl.push('HomePage');
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  NoWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

}
