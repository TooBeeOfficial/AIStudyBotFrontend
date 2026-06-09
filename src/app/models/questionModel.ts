import { AnswerModel } from './answerModel';
import { AnswerTableModel } from './answerTableModel';

export class QuestionModel {
  id!: number;
  question!: string;
  correctAnswer!: AnswerModel;
  answerTable!: AnswerTableModel;

  constructor(
    id: number = 0,
    question: string = '',
    correctAnswer: AnswerModel = {} as AnswerModel,
    answerTable: AnswerTableModel = new AnswerTableModel(),
  ) {
    this.id = id;
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.answerTable = answerTable;
  }

  static fromApi(data: any): QuestionModel {
    const question = new QuestionModel();

    question.id = data.id;
    question.question = data.question;
    question.correctAnswer = data.correct_answer;
    question.answerTable = AnswerTableModel.fromApi(data.answers);

    return question;
  }
}
