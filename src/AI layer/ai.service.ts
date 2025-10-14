/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { askTutor as askTutorNode } from './services/aiService';

@Injectable()
export class AiService {
  async  askTutor(messages: any, history?: any): Promise<string> {
    // The existing Node implementation expects (userInput, memoryContext)
    const reply = await askTutorNode(messages, history);
    return reply ?? '';
  }
}


