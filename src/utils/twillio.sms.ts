// utils/twillio.sms.ts

import * as Twilio from 'twilio';  // <-- Change this line

// Set your Twilio Account SID, Auth Token, and Twilio phone number
const accountSid = 'AC72922ad89eff6f72bc49fe5cabfaa037';
const authToken = '7736b3577cfce8e87abe9d243710120e';
const twilioPhoneNumber = '+13617301049';

const twilioClient = Twilio(accountSid, authToken);

interface SendSmsOptions {
  to: string;
  body: string;
}

export const sendSms = async ({ to, body }: SendSmsOptions): Promise<void> => {
    try {
        const message = await twilioClient.messages.create({
          to,
          from: twilioPhoneNumber,
          body,
        });
        
        console.log('Twilio SMS sent:', message.sid);
      } catch (error) {
        console.error('Error sending Twilio SMS:', error.response ? error.response.data : error.message);
        throw new Error('Error sending SMS');
      }      
};
