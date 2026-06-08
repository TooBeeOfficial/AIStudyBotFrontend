import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AIModel } from '../../models/aiModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AIBotService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getAIModels(): Observable<AIModel[]> {
    return this.http.get<AIModel[]>(this.apiURL + '/models', {
      withCredentials: true,
    });
  }

  askAIBot(message: string, chatId: number, modelId: number): Observable<JSON> {
    return this.http.post<JSON>(
      `${this.apiURL}/chat?chatId=${chatId}`,
      {
        message: message,
        model: modelId,
      },
      {
        withCredentials: true,
      },
    );
  }
}
