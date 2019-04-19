import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CognitiveApiService {
  subscriptionKey = environment.SUBCRIPRION_KEY;
  uriBase = environment.AZURE_API_URL;
  constructor(private http: HttpClient) { } 
  getCognitiveIntel(imageUrl) { 
    // Request parameters.
    const params = {
      'visualFeatures': 'Categories,Description,Color',
      'details': '',
      'language': 'en'
    }; 
   let options = {
      uri: this.uriBase,
      params: params, 
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey
      }
    }; 
    return this.http.post<any>( this.uriBase, '{"url": ' + '"' + imageUrl + '"}', options); 
  }
}
