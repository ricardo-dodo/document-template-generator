import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [DocumentService],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call generateDocument on DocumentService', async () => {
    const mockPdfFile = {
      buffer: Buffer.from('mock pdf content'),
    } as Express.Multer.File;

    const generateDocumentSpy = jest.spyOn(service, 'generateDocument').mockResolvedValue('mock document content');

    const result = await controller.generateDocument(mockPdfFile);

    expect(generateDocumentSpy).toHaveBeenCalledWith('template1', mockPdfFile);
    expect(result).toBe('mock document content');
  });
});