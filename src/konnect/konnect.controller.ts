// konnect.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { KonnectService } from './konnect.service';

@Controller('konnect')
export class KonnectController {
  constructor(private readonly konnectService: KonnectService) {}

  @Post('/payments/init-payment')
  async initiatePayment(@Body() paymentRequest: any) {
    return this.konnectService.initiatePayment(paymentRequest);
  }

  @Get('/payments/:paymentId')
  async getPaymentDetails(@Param('paymentId') paymentId: string) {
    return this.konnectService.getPaymentDetails(paymentId);
  }
}
