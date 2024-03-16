export interface IMessage {
  role: string;
  content: string;
  name?: string;
}

export interface IConversationPaylod {
  model: string;
  token_limit: number;
  messages: any[];
}

export interface IConversationResp {
  id: string;
  message: IMessage;
  usage: {
    total_tokens: number;
  };
}

export interface INewConversation {
  chatId: string;
  userId: string;
  model: string;
  messages: IMessage[];
}