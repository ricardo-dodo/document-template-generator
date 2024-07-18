import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('generate')
  @UseInterceptors(FileInterceptor('pdfFile'))
  async generateDocument(@UploadedFile() pdfFile: Express.Multer.File): Promise<string> {
    return this.documentService.generateDocument('template1', pdfFile);
  }
}