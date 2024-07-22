import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import * as fs from 'fs';

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentService],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate document content', async () => {
    const mockPdfFile = {
      buffer: Buffer.from('mock pdf content'),
    } as Express.Multer.File;

    jest.spyOn(fs.promises, 'readFile').mockResolvedValue('<html>{{title}}</html>');
    jest.spyOn<any, any>(service, 'extractTextFromPDF').mockResolvedValue('mock pdf text');

    const result = await service.generateDocument('template1', mockPdfFile);

    expect(result).toBe('<html>Document Title</html>');
  });
});