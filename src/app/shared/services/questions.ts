import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { QuestionModel } from '../../models/questionModel';

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
}
