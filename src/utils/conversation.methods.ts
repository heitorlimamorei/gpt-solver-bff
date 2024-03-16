import { IMessage } from "../types/conversation.types";

export const checkConversation = (messages: IMessage[]): boolean => {
  let result: boolean = true;

  messages.forEach((message) => {
    if (
      message.role == "assistant" ||
      message.role == "system" ||
      message.role == "user"
    ) {
      result = true;
    } else {
      result = false;
    }
    if (!!message.content) {
      result = true;
    } else {
      result = false;
    }
  });
  return result;
};

export const checkGPTModel = (model: string): boolean => {
  if (
    model == "gpt-4-turbo-preview" ||
    model == "gpt-4" ||
    model == "gpt-3.5-turbo-0125"
  ) {
    return true;
  }
  return false;
};
