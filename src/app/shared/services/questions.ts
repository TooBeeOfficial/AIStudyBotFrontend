import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { QuestionModel } from '../../models/questionModel';
import { AnswerTableModel } from '../../models/answerTableModel';
import { AnswerModel } from '../../models/answerModel';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private apiURL = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private questionSubject = new BehaviorSubject<QuestionModel | null>(null);

  question$ = this.questionSubject.asObservable();

  get question(): QuestionModel | null {
    return this.questionSubject.value;
  }
  setUser(question: QuestionModel | null) {
    this.questionSubject.next(question);
  }
  clearUser() {
    this.questionSubject.next(null);
  }
  createNewQuestion(question: any, chatId: number) {
    const answers = AnswerTableModel.toStringArray(question.answers);
    const correct = question.correct.answer;
    return this.http.post(
      this.apiURL + `/question/create?chatId=${chatId}`,
      {
        question: question.question.question ?? question.question,
        answers: answers,
        correct: correct,
      },
      { withCredentials: true },
    );
  }
}
