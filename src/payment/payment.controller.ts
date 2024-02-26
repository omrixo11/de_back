// payment.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() paymentData: any): Promise<any> {
    try {
      const paymentResponse = await this.paymentService.initiatePayment(paymentData);
      return { success: true, data: paymentResponse };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':paymentId')
  async getPaymentDetails(@Param('paymentId') paymentId: string): Promise<any> {
    try {
      const paymentDetails = await this.paymentService.getPaymentDetails(paymentId);
      return { success: true, data: paymentDetails };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
