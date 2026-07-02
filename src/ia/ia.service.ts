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

    const parsed = JSON.parse(response.text! || '{}') as { words?: string[] };
    const words = Array.isArray(parsed.words) ? parsed.words : [];

    const validatedWords = await Promise.all(
      words.map(async (word) => {
        const exists = await this.searchArasaac(word);
        return exists ? word : null;
      }),
    );

    return {
      words: validatedWords.filter((word): word is string => word !== null),
    };
  }

  private async searchArasaac(word: string): Promise<boolean> {
    try {
      const url = `https://api.arasaac.org/v1/pictograms/es/search/${encodeURIComponent(word)}`;
      const response = await fetch(url);
      if (!response.ok) {
        return false;
      }
      const result = await response.json();
      return Array.isArray(result) && result.length > 0;
    } catch {
      return false;
    }
  }
}
