import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profile } from '../app/models.interface';

@Injectable()
export class ApiProvider {

  SAVE_PROFILE_URL = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {
  }

  saveProfile(profile: Profile) {
    return new Promise(resolve => {
      this.http.post(this.SAVE_PROFILE_URL, profile).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
