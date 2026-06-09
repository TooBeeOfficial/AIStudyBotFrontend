export class MessageModel {
  id!: number;
  chat_id!: number;
  role!: string;
  content!: string;

  constructor(id: number = -1, chat_id: number = -1, role: string = '', content: string = '') {
    this.id = id;
    this.chat_id = chat_id;
    this.role = role;
    this.content = content;
  }

  static fromApi(data: any): MessageModel {
    const message = new MessageModel();

    message.id = data.id;
    message.chat_id = data.chat_id;
    message.role = data.role;
    message.content = data.content;

    return message;
  }
}
