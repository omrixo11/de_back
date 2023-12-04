// konnect.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class KonnectService {
    async initiatePayment(paymentRequest: any): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(
                'https://api.preprod.konnect.network/api/v2/payments/init-payment',
                paymentRequest,
                {
                    headers: {
                        'x-api-key': '656225cc757f299608e96d73:OgRjt0FvTZUQmsfPKXpGxDLsh',
                        'Content-Type': 'application/json',
                    },
                }
            );

            const { payUrl, paymentRef } = response.data;
            return { payUrl, paymentRef };
        } catch (error) {
            console.error('Error initiating payment:', error);
            console.log('Response Data:', error.response.data);
            throw error;
        }
    }

    async getPaymentDetails(paymentId: string): Promise<any> {
        // Implement logic to fetch payment details using the Konnect API
        // Example: const result = await konnectApi.getPaymentDetails(paymentId);
        return { /* Payment details object */ };
    }
}
