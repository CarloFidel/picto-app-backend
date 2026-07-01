import { Injectable } from '@nestjs/common';
import { GenerateWordsDto } from './dto/create-ia.dto';
import { User } from '../auth/entities/auth.entity';
import { GoogleGenAI } from '@google/genai';
import { instructions } from './helper/instruction';

@Injectable()
export class IaService {
  private readonly googleIA: GoogleGenAI;

  constructor() {
    this.googleIA = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generate(generateWordsDto: GenerateWordsDto, user: User) {
    const response = await this.googleIA.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
          Generate exactly 10 words related to:
          "${generateWordsDto.action}"
        `,
      config: {
        systemInstruction: instructions,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',

          properties: {
            words: {
              type: 'array',

              items: {
                type: 'string',
              },
            },
          },
        },
      },
    });
    return JSON.parse(response.text!);
  }
}
