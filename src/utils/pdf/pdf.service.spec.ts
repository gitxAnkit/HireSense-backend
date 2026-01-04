import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import pdf = require('pdf-parse');

jest.mock('pdf-parse', () => {
  return jest.fn();
});

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    (pdf as unknown as jest.Mock).mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse pdf buffer and return text', async () => {
    const mockBuffer = Buffer.from('mock pdf content');
    const mockText = 'Parsed PDF Text';
    (pdf as unknown as jest.Mock).mockResolvedValue({ text: mockText });

    const result = await service.parse(mockBuffer);

    expect(result).toEqual(mockText);
    expect(pdf).toHaveBeenCalledWith(mockBuffer);
  });
});
