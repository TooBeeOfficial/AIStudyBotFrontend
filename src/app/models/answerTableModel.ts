import { AnswerModel } from './answerModel';

export class AnswerTableModel {
  answer!: AnswerModel[];

  static fromApi(data: any): AnswerTableModel {
    const answerList = new AnswerTableModel();

    answerList.answer = Array.isArray(data.answers)
      ? data.answers.map((a: any) => AnswerModel.fromApi(a))
      : [];
    return answerList;
  }
}
