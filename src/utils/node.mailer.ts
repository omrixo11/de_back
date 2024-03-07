// utils/node.mailer.ts
import * as nodemailer from 'nodemailer';

export class NodeMailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net', // Common OVH SMTP server, verify this with OVH documentation or support
      port: 587, // Standard port for SMTP, check if OVH recommends a different one
      secure: false, // Typically false for port 587, but verify with OVH
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
