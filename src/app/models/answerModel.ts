export class AnswerModel{
    id!:number;
    questionId!:number;
    answer!:string;

    static fromApi(data: any): AnswerModel {
        const answer = new AnswerModel();

        answer.id = data.id;
        answer.questionId = data.question_id;
        answer.answer = data.answer_text;

        return answer;
    }
}