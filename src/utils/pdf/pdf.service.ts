import { Injectable, BadRequestException } from '@nestjs/common';
import * as pdf from 'pdf-parse';
@Injectable()
export class PdfService {
  async parse(buffer: Buffer): Promise<string> {
    try {
      const data = await (pdf as any)(buffer);
      return data.text;
    } catch (err) {
      throw new BadRequestException('Unable to parse PDF file');
    }
  }
}
