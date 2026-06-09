import { inject, Injectable, model } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AIModel } from '../../models/aiModel';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AIBotService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private AIModels = new BehaviorSubject<AIModel[] | null>(null);
  AIModels$ = this.AIModels.asObservable();

  get AIModelList() {
    return this.AIModels.value;
  }
  setAIModels(models: AIModel[]) {
    this.AIModels.next(models);
  }

  getAIModels(): Observable<AIModel[]> {
    const models = this.http
      .get<AIModel[]>(this.apiURL + '/models', {
        withCredentials: true,
      });
    return models;
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
