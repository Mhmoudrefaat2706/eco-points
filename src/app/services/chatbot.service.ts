import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private dataUrl = 'assets/data/chatbot_response.json'; 
  

  constructor(private http: HttpClient) { }

  getChatbotResponses(): Observable<any> {
    return this.http.get(this.dataUrl);
  }
}