import { Injectable, NotFoundException } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import { Document } from './document.interface';
import * as pdf from 'pdf-parse';

@Injectable()
export class DocumentService {
async generateDocument(templateName: string, pdfFile: Express.Multer.File): Promise<string> {
    if (!templateName) {
      throw new NotFoundException('Template name is required.');
    }

    const pdfText = await this.extractTextFromPDF(pdfFile);
    const data: Document = {
      title: 'Document Title',
      content: pdfText,
      author: 'Author Name',
      createdAt: new Date(),
    };

    const templatePath = `./src/templates/${templateName}.hbs`;
    const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(data);
  }

  private async extractTextFromPDF(pdfFile: Express.Multer.File): Promise<string> {
    const dataBuffer = pdfFile.buffer;
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  }
}