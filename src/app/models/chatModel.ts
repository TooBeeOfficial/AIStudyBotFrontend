import { MessageModel } from './chatMessageModel';

export class ChatModel {
  id: number;
  messages: MessageModel[];
  firstMessage?: MessageModel;

  constructor(
    id: number = 0,
    messages: MessageModel[] = [],
    firstMessage?: MessageModel
  ) {
    this.id = id;
    this.messages = messages;
    this.firstMessage = firstMessage;
  }

  static fromApi(data: any): ChatModel {
    const messages = Array.isArray(data.messages)
      ? data.messages.map((m: any) => MessageModel.fromApi(m))
      : [];

    return new ChatModel(
      data.id,
      messages,
      data.firstMessage ? MessageModel.fromApi(data.firstMessage) : undefined
    );
  }
}