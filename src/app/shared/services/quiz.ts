import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { QuizModel } from '../../models/quizModel';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { QuestionModel } from '../../models/questionModel';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private quizSubject = new BehaviorSubject<QuizModel | null>(null);

  quiz$ = this.quizSubject.asObservable().pipe(distinctUntilChanged());

  setQuiz(quiz: QuizModel) {
    this.quizSubject.next(quiz);
  }

  getQuizFromChat(chatId: number) {
    return this.http
      .get<any[]>(`${this.apiURL}/quiz?chatId=${chatId}`, {
        withCredentials: true,
      })
      .pipe(
        map((data) => {
          const quiz = new QuizModel();
          quiz.quiz = data.map((q) => QuestionModel.fromApi(q));
          return quiz;
        }),
      );
  }
}
