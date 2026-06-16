import { AnswerModel } from './answerModel';

export class AnswerTableModel {
  answers!: AnswerModel[];

  constructor(answers: AnswerModel[] = []) {
    this.answers = answers;
  }

  static toStringArray(table:AnswerModel[]): string[] {
    return table.map((a) => a.answer);
  }

  static fromApi(data: any): AnswerTableModel {
    const answerList = new AnswerTableModel();

    answerList.answers = Array.isArray(data)
      ? data.map((a: any) => AnswerModel.fromApi(a))
      : [];
    return answerList;
  }
}
