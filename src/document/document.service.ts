import { Injectable, NotFoundException } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import { Document } from './document.interface';

@Injectable()
export class DocumentService {
  async generateDocument(templateName: string, data: Document): Promise<string> {
    if (!templateName) {
      throw new NotFoundException('Template name is required.');
    }

    const templatePath = `./src/templates/${templateName}.hbs`;
    const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(data);
  }
}