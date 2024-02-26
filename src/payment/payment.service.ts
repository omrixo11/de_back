// payment.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly baseUrl = 'https://api.preprod.konnect.network/api/v2'; // Sandbox environment
  private readonly apiKey = '656225cc757f299608e96d73:Ozzi73RW4v6vi4zSMnQMZKmqJg'; // Replace with your actual API key

  async initiatePayment(paymentData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/payments/init-payment`, paymentData, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/payments/${paymentId}`, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
