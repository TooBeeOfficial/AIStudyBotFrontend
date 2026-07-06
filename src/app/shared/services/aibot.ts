import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AIModel } from '../../models/aiModel';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AIBotService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private AIModels = new BehaviorSubject<AIModel[]>([]);
  AIModels$ = this.AIModels.asObservable();

  get AIModelList() {
    return this.AIModels.value;
  }
  setAIModels(models: AIModel[]) {
    this.AIModels.next(models);
  }

  getAIModels(): Observable<AIModel[]> {
    return this.http
      .get<AIModel[]>(this.apiURL + '/models', {
        withCredentials: true,
      })
      .pipe(map((models) => models.map((m) => AIModel.fromApi(m))));
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
