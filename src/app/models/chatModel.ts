import { MessageModel } from './chatMessageModel';

export class ChatModel {
  id!: number;
  messages!: MessageModel[];
  firstMessage?:MessageModel;

  static fromApi(data: any): ChatModel {
    const chat = new ChatModel();

    chat.id = data.id;
    chat.messages = Array.isArray(data.messages)
      ? data.messages.map((m: any) => MessageModel.fromApi(m))
      : [];

    return chat;
  }
}
