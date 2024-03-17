// utils/node.mailer.ts
import * as nodemailer from 'nodemailer';

export class NodeMailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 587, 
      secure: false, 
      auth: {
        user: 'noreply@dessa.tn',
        pass: 'OTSdaliSupport1997',
      },
    });
  }
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: 'noreply@dessa.tn',
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
