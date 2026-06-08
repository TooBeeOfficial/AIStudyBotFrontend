import { AnswerModel } from "./answerModel";
import { AnswerTableModel } from "./answerTableModel";

export class QuestionModel {
    id!:number;
    question!:string;
    correctAnswer!:AnswerModel;
    answerTable!:AnswerTableModel;

    static fromApi(data: any): QuestionModel {
        const question = new QuestionModel();

        question.id = data.id;
        question.question = data.question;
        question.correctAnswer = data.correct_answer;
        question.answerTable = AnswerTableModel.fromApi(data.answers);

        return question;
    }
}