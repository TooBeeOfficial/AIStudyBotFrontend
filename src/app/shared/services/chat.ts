import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ChatModel } from '../../models/chatModel';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private chatSubject = new BehaviorSubject<ChatModel | null>(null);

  chat$ = this.chatSubject.asObservable();

  get chat(): ChatModel | null {
    return this.chatSubject.value;
  }
  setUser(chat: ChatModel | null) {
    this.chatSubject.next(chat);
  }
  clearUser() {
    this.chatSubject.next(null);
  }
  createNewChat(){
    return this.http.post(this.apiURL + '/me/newchat', {}, { withCredentials: true });
  }
}
