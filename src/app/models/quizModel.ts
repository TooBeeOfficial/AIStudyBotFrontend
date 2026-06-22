import { QuestionModel } from './questionModel';

export class QuizModel {
  questions!: QuestionModel[];

  static fromApi(data: any[]): QuestionModel[] {
    return data.map((question) => QuestionModel.fromApi(question));
  }
}
