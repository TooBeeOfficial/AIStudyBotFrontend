import { QuestionModel } from './questionModel';

export class QuizModel {
  questions!: QuestionModel[];

  constructor(questions: QuestionModel[] = []) {
    this.questions = questions;
  }

  static fromApi(data: any[]): QuestionModel[] {
    return data.map((question) => QuestionModel.fromApi(question));
  }
}
