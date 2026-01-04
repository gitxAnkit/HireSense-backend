import { Test, TestingModule } from '@nestjs/testing';
import { GeminiService } from './gemini.service';
import { ConfigService } from '@nestjs/config';

// Mock the GoogleGenerativeAI class
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn().mockReturnValue({
  generateContent: mockGenerateContent,
});

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    })),
  };
});

describe('GeminiService', () => {
  let service: GeminiService;

  beforeEach(async () => {
    mockGenerateContent.mockReset();
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(['Question 1', 'Question 2']),
      },
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate questions', async () => {
    const jobDescription = 'Software Engineer nodejs';
    const result = await service.generateQuestions(jobDescription);
    expect(result).toBe(JSON.stringify(['Question 1', 'Question 2']));
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({
      model: 'gemini-flash-latest',
    });
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.stringContaining(jobDescription),
    );
  });
});
