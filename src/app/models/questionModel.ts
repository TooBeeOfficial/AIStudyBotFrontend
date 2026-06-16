import { AnswerModel } from './answerModel';
import { AnswerTableModel } from './answerTableModel';

export class QuestionModel {
  id!: number;
  question!: string;
  correctAnswer!: AnswerModel;
  answers!: AnswerTableModel;

  constructor(
    id: number = 0,
    question: string = '',
    correctAnswer: AnswerModel = {} as AnswerModel,
    answerTable: AnswerTableModel = new AnswerTableModel(),
  ) {
    this.id = id;
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.answers = answerTable;
  }

  static fromApi(data: any): QuestionModel {
    const question = new QuestionModel();

    question.id = data.id;
    question.question = data.question;
    question.correctAnswer = data.correct_answer;
    question.answers = AnswerTableModel.fromApi(data.answers);

    return question;
  }
}
