export class MessageModel {
    id!:number;
    role!:string;
    content!:string;

    static fromApi(data: any): MessageModel {
        const message = new MessageModel();

        message.id = data.id;
        message.role = data.role;
        message.content = data.content;

        return message;
    }
}