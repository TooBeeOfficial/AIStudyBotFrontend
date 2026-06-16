import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { QuizModel } from '../../models/quizModel';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private quizSubject = new BehaviorSubject<QuizModel | null>(null);

  quiz$ = this.quizSubject.asObservable().pipe(
    distinctUntilChanged((prev, curr) => {
      if (!prev || !curr) return prev === curr;

      if (prev.quiz.length !== curr.quiz.length) return false;

      return prev.quiz.every((q, index) => q.id === curr.quiz[index].id);
    }),
  );

  getQuizFromChat(chatId: number) {
    return this.http.get<QuizModel>(this.apiURL + `/quiz?chatId=${chatId}`, {
      withCredentials: true,
    });
  }
}
