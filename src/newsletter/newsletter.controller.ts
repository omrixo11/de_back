import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus  } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body('email') email: string) {
    try {
      await this.newsletterService.subscribe(email);
      return { message: 'Subscription successful' };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('send-emails')
  @HttpCode(HttpStatus.OK)
  async sendEmailToAllSubscribers(@Body() body: { subject: string; title: string; content: string }) {
    try {
      await this.newsletterService.sendNewsletterUpdate(body.subject, body.title, body.content);
      return { message: 'Emails are being sent to all subscribers.' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
  
}

