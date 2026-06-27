import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { QuestionModel } from '../../models/questionModel';
import { AnswerTableModel } from '../../models/answerTableModel';

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
  setQuestion(question: QuestionModel | null) {
    this.questionSubject.next(question);
  }
  clearQuestion() {
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

  updateQuestion(question: any) {
    const correct = question.correct.id;
    return this.http.put(
      this.apiURL + `/question/update?questionId=${question.id}`,
      {
        question: question.question.question,
        answers: question.answers,
        correct: correct,
      },
      { withCredentials: true },
    );
  }

  deleteQuestion(questionId: number) {
    return this.http.delete(this.apiURL + `/question/delete?questionId=${questionId}`, {
      withCredentials: true,
    });
  }

  questionCorrect(questionId: number) {
    return this.http.get(this.apiURL + `/question/correct?questionId=${questionId}`, {
      withCredentials: true,
    });
  }

  questionCheckCorrect(questionId: number, answerId: number) {
    return this.http.get(
      this.apiURL + `/question/checkAnswer?questionId=${questionId}&answerID=${answerId}`,
      {
        withCredentials: true,
      },
    );
  }
}
