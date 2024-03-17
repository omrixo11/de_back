import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Newsletter } from 'src/schemas/newsletter.schema';
import { Model } from 'mongoose';
import { NodeMailerService } from 'src/utils/node.mailer';
import { newsletterUpdateTemplate } from 'src/utils/email.templates';

@Injectable()
export class NewsletterService {

  private nodeMailerService: NodeMailerService;

  constructor(@InjectModel(Newsletter.name) private newsletterModel: Model<Newsletter>) {
    this.nodeMailerService = new NodeMailerService();
  }

  async subscribe(email: string): Promise<Newsletter> {
    let newsletter = await this.newsletterModel.findOne().exec();
    if (!newsletter) {
      // Create a new document if none exists
      newsletter = new this.newsletterModel({ emails: [email] });
    } else if (!newsletter.emails.includes(email)) {
      // Add email to the array if not already included
      newsletter.emails.push(email);
    } else {
      // Email already subscribed
      throw new NotFoundException(`Email ${email} is already subscribed.`);
    }

    // Validate and save the updated document
    await newsletter.validate();
    return newsletter.save();
  }

  async sendNewsletterUpdate(subject: string, title: string, content: string): Promise<void> {
    const newsletter = await this.newsletterModel.findOne().exec();

    if (!newsletter || !newsletter.emails.length) {
      throw new NotFoundException('No subscribers found.');
    }

    const htmlContent = newsletterUpdateTemplate(subject, title, content);

    for (const email of newsletter.emails) {
      try {
        await this.nodeMailerService.sendEmail(email, subject, htmlContent);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    }

    console.log('Emails dispatch initiated.');
  }
}
