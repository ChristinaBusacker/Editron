import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import mjml2html from 'mjml';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {}

  async renderTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = join(__dirname, 'templates', `${templateName}.mjml`);

    if (!fs.existsSync(templatePath)) {
      console.log(templatePath);
      throw new NotFoundException(`Template ${templateName} not found`);
    }

    let mjml = fs.readFileSync(templatePath, 'utf8');

    Object.keys(data).forEach(key => {
      // TODO: maybe html encode
      mjml = mjml.replace(`{{${key}}}`, data[key]);
    });

    const htmlOutput = mjml2html(mjml);

    return htmlOutput.html;
  }

  async sendEmail(email: string, subject: string, html: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: this.config.get('MAIL_HOST'),
        port: this.config.get('MAIL_PORT'),
        secure: true,
        auth: {
          user: this.config.get('MAIL_USER'),
          pass: this.config.get('MAIL_PASS'),
        },
      });

      await transporter.sendMail({
        from: `"RacingTest" ${this.config.get('MAIL_USER')}`,
        to: email,
        subject: subject,
        html: html,
      });

      console.log(`📨 Mail sended to ${email} (${subject})`);
    } catch (error) {
      console.error(`Error sending a Mail to ${email} ${error}`);
    }
  }
}
