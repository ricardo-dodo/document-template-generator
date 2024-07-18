import { Controller, Post, Body } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from './document.interface';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('generate')
  async generateDocument(@Body() body: { templateName: string; data: Document }): Promise<string> {
    return this.documentService.generateDocument(body.templateName, body.data);
  }
}