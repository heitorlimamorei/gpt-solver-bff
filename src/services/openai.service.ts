import openai from "../openaiconfig";
import { IConversationPaylod, IConversationResp, IMessage, INewConversation } from "../types/conversation.types";
import { checkConversation, checkGPTModel } from "../utils/conversation.methods";
import { PromiseScheduler, get, post } from "../utils/requests";


interface INewConversationResp {
    conversation: IMessage[];
    total_tokens: number;
}

export interface IOpenaiService {
    createConversation(conversation: INewConversation): Promise<INewConversationResp>;
}

interface ITokensCountResp {
    tokensCount: number;
}

const generateConversation = async (payload: IConversationPaylod): Promise<IConversationResp> => {
    const resp = await openai.chat.completions.create({
      model: payload.model,
      messages: payload.messages,
    });
  
    return {
      id: resp.id,
      message: {
        role: resp.choices[0].message.role,
        content: resp.choices[0].message.content!,
      },
      usage: {
        total_tokens: resp.usage?.total_tokens!,
      },
    };
}

const generateServiceError = (message: string, status: number) => {
    throw new Error(`SERVICE:${message}-${status}`);
};

async function getUserLimit(userId: string) {
    const { tokensCount } = await get<ITokensCountResp>(`/v1/user/tokenscount/${userId}`);
    return tokensCount;
}

async function AddMessage(message: IMessage, chatId: string) {
    await post(`/v1/chat/${chatId}/messages`, { chatId: chatId, content: message.content, role: message.role});
}

async function removeTokensFromUser(userId: string, count: number) {
    await post(`/v1/user/${userId}/charge`, { count });
}

export default function getOpenaiService(): IOpenaiService {
    async function createConversation(payload: INewConversation): Promise<INewConversationResp> {
        if (!checkGPTModel(payload.model)) {
            generateServiceError("Invalid model", 400);
        }

        if (!checkConversation(payload.messages)) {
            generateServiceError("Invalid conversation {role, content} (malformed body)", 400);
        }
        const tokensLimit = await getUserLimit(payload.userId);
        
        if (tokensLimit == 0) {
          generateServiceError("Insufficient tokens", 400);
        }
        
        let messages = [...payload.messages];

        const resp = await generateConversation({
          model: payload.model,
          token_limit: tokensLimit,
          messages: payload.messages,
        });
        
        messages.push(resp.message);
        
        const cost =  resp.usage.total_tokens;
        
        await PromiseScheduler([
          AddMessage(resp.message, payload.chatId),
          removeTokensFromUser(payload.userId, cost)
        ]);

        return {
          conversation: messages,
          total_tokens: resp.usage.total_tokens,
        };
    }

    return {
        createConversation,
    };
}