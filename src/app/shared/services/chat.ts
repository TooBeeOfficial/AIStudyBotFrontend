import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ChatModel } from '../../models/chatModel';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private chatSubject = new BehaviorSubject<ChatModel | null>(null);
  private allchats = new BehaviorSubject<ChatModel[] | null>(null);

  chat$ = this.chatSubject.asObservable();
  allchats$ = this.allchats.asObservable();

  get chat(): ChatModel | null {
    return this.chatSubject.value;
  }
  get allChats(): ChatModel[] | null {
    return this.allChats;
  }
  setChat(chat: ChatModel | null) {
    this.chatSubject.next(chat);
  }
  setChats(chat: ChatModel[] | null) {
    this.allchats.next(chat);
  }
  clearChats() {
    this.chatSubject.next(null);
  }

  getChats() {
    return this.http.get<ChatModel[]>(this.apiURL + '/me/chats', { withCredentials: true });
  }

  loadChat() {
    const chats = this.getChats().pipe(
      tap((chats) => this.setChats(chats.map((chat: any) => ChatModel.fromApi(chat)))),
    );
    return chats;
  }
  createNewChat() {
    return this.http.post(this.apiURL + '/me/newchat', {}, { withCredentials: true });
  }
}
