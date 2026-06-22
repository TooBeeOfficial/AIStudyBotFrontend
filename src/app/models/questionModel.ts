import { AnswerModel } from './answerModel';

export class QuestionModel {
  id!: number;
  question!: string;
  correctAnswer!: number;
  answers!: AnswerModel[];

  constructor(
    id: number = 0,
    question: string = '',
    correctAnswer: number = -1,
    answerTable: AnswerModel[] = [],
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
    question.answers = data.answers.map(AnswerModel.fromApi);

    return question;
  }
}
