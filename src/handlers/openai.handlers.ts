import { NextFunction, Request, Response } from "express";
import { IOpenaiService } from "../services/openai.service";
import { INewConversation } from "../types/conversation.types";

export interface IOpenaiHandlers {
    getCompletation(req: Request, res: Response, next: NextFunction): Promise<void>;
}

const generateHandlereError = (message: string, status: number) => {
    throw new Error(`HANDLER:${message}-${status}`);
};

export default function getOpenaiHandlers(services: IOpenaiService): IOpenaiHandlers{
    async function getCompletation(req: Request, res: Response, next: NextFunction) {
       try {
        const data = req.body as INewConversation; 

        if (!data.chatId) {
            generateHandlereError("Invalid chatId", 400);
        }
        if (!data.userId) {
            generateHandlereError("Invalid userId", 400);
        }
        if (!data.model) {
            generateHandlereError("Invalid model", 400);
        }
        if (data.messages.length == 0) {
            generateHandlereError("Invalid messages", 400);
        }

        const resp = await services.createConversation(data);

        res.status(200).json(resp);

       } catch (err: any) {
        next(err.message);
       }
    }

    return {
        getCompletation,
    }
}