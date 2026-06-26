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

  loadChats() {
    return this.getChats().pipe(
      tap((chats) => {
        const mappedChats = chats.map((chat: ChatModel) => ChatModel.fromApi(chat));

        this.setChats(mappedChats);
        this.setChat(mappedChats[0] ?? null);
      }),
    );
  }

  createNewChat() {
    const result = this.http.post(this.apiURL + '/me/newchat', {}, { withCredentials: true });
    return result;
  }

  deleteChat(chatId: number) {
    console.log(chatId);
    const result = this.http.delete(this.apiURL + `/chat/delete?chatId=${chatId}`, {
      withCredentials: true,
    });
    console.log(this.apiURL + `/chat/delete?chatId=${chatId}`);
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
