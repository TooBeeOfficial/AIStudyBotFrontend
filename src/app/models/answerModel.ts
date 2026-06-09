export class AnswerModel {
  id!: number;
  questionId!: number;
  answer!: string;

  constructor(id: number = 0, questionId: number = 0, answer: string = '') {
    this.id = id;
    this.questionId = questionId;
    this.answer = answer;
  }

  static fromApi(data: any): AnswerModel {
    const answer = new AnswerModel();

    answer.id = data.id;
    answer.questionId = data.question_id;
    answer.answer = data.answer_text;

    return answer;
  }
}
