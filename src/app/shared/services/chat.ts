import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, take, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { ChatModel } from '../../models/chatModel';
import { MessageModel } from '../../models/chatMessageModel';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private chatSubject = new BehaviorSubject<ChatModel | null>(null);
  private allchatsSubject = new BehaviorSubject<ChatModel[] | null>(null);

  chat$ = this.chatSubject
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) =>
          prev?.id === curr?.id &&
          prev?.messages === curr?.messages &&
          prev?.firstMessage === curr?.firstMessage,
      ),
    );
  allchats$ = this.allchatsSubject.asObservable();

  get getChat(): ChatModel | null {
    return this.chatSubject.value;
  }
  get getAllChats(): ChatModel[] | null {
    return this.allchatsSubject.value;
  }

  setChat(chat: ChatModel | null) {
    this.chatSubject.next(chat);
  }

  setChats(chat: ChatModel[] | null) {
    this.allchatsSubject.next(chat);
  }

  clearChats() {
    this.chatSubject.next(null);
  }

  getChats() {
    const result = this.http.get<ChatModel[]>(this.apiURL + '/me/chats', { withCredentials: true });
    return result;
  }

  loadChat() {
    const chats = this.getChats();
    chats.subscribe((chats) => {
      this.setChats(chats.map((chat: ChatModel) => ChatModel.fromApi(chat)));
      this.setChat(chats[chats.length - 1]);
    });
    return chats;
  }
  createNewChat() {
    const result = this.http.post(this.apiURL + '/me/newchat', {}, { withCredentials: true });
    return result;
  }

  getChatHistory(chatId: number) {
    return this.http.get<MessageModel[]>(`${this.apiURL}/chat/history?chatId=${chatId}`, {
      withCredentials: true,
    });
  }

  getFirstMessageForChat(chatId: number) {
    return this.http.get<MessageModel>(`${this.apiURL}/chat/lastmessage?chatId=${chatId}`, {
      withCredentials: true,
    });
  }

  getAllFirstMessages() {
    return this.http.get<MessageModel[]>(`${this.apiURL}/chat/lastmessage/all`, {
      withCredentials: true,
    });
  }
}
