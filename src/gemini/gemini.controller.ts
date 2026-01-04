import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate-questions')
  async generateQuestions(@Body('jobDescription') jobDescription: string) {
    return this.geminiService.generateQuestions(jobDescription);
  }
}
