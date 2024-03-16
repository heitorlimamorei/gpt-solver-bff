import express from 'express';
import getOpenaiService from '../services/openai.service';
import getOpenaiHandlers from '../handlers/openai.handlers';

const openaiRouter = express.Router();

const service = getOpenaiService();
const handlers = getOpenaiHandlers(service);

openaiRouter.post("/gencompletation", handlers.getCompletation);

export default openaiRouter;