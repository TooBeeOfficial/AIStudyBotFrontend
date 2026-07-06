import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
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

  chat$ = this.chatSubject.asObservable();
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
    return this.http.get<ChatModel[]>(this.apiURL + '/me/chats', { withCredentials: true });
  }

  loadChats(chatId: number = -1) {
    return this.getChats().pipe(
      tap((chats) => {
        const mappedChats = chats.map((chat: ChatModel) => ChatModel.fromApi(chat));
        this.setChats(mappedChats);
        if (chatId === -1) {
          this.setChat(mappedChats[0] ?? null);
        } else {
          const newChat = mappedChats.find((chat) => chat.id === chatId);
          this.setChat(newChat ?? null);
        }
      }),
    );
  }

  createNewChat() {
    return this.http.post<{ id: number }>(
      this.apiURL + '/me/newchat',
      {},
      { withCredentials: true },
    );
  }

  deleteChat(chatId: number) {
    return this.http.delete(this.apiURL + `/chat/delete?chatId=${chatId}`, {
      withCredentials: true,
    });
  }

  getChatHistory(chatId: number) {
    console.log('HISTORY CHAT ID: ', chatId);
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
