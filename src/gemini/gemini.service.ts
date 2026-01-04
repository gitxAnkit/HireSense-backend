import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
    });
  }

  async generateQuestions(jobDescription: string): Promise<string> {
    const prompt = `Generate a list of 5-10 technical interview questions based on the following job description. 
    Format the output as a JSON array of strings. Do not include any markdown formatting or explanations,
     just the raw JSON string.\n\nJob Description:\n${jobDescription}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      if (error.status === 429) {
        throw new HttpException(
          'Gemini API Rate Limit Exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Failed to generate questions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
