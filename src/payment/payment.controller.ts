import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('/callback')
  async handlePaymentCallback(@Body() callbackData: any) {
    if (!callbackData.success) {
      return { message: 'Payment processing failed' };
    }

    const { paymentId, paymentType } = callbackData;

    try {
      switch (paymentType) {
        case 'plan':
          // Confirm plan purchase
          await this.paymentService.confirmPaymentSuccessById(paymentId);
          break;
        case 'boost':
          // Confirm boost purchase
          await this.paymentService.confirmBoostPaymentSuccess(paymentId);
          break;
        case 'adsbanner':
          // Confirm boost purchase
          await this.paymentService.confirmAdsBannerPaymentSuccess(paymentId);
          break;
        default:
          throw new BadRequestException('Invalid payment type');
      }

      return { message: 'Payment processed successfully' };
    } catch (error) {
      console.error('Error processing payment callback:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('/confirm-by-id')
  async confirmPaymentById(@Body() body: { paymentId: string, success: boolean }) {
    if (!body.paymentId) {
      throw new BadRequestException('Payment ID is required');
    }
    if (body.success) {
      await this.paymentService.confirmPaymentSuccessById(body.paymentId);
      // Optionally, return a success message or the updated payment record
      return { message: 'Payment confirmed successfully' };
    } else {
      // Handle failure case as needed
      return { message: 'Payment confirmation failed' };
    }
  }

  @Post('/use-gift-card')
  async payWithGiftCard(@Body() body: { userId: string; giftCardCode: string }) {
    if (!body.userId || !body.giftCardCode) {
      throw new BadRequestException('UserId and GiftCardCode are required');
    }

    try {
      const user = await this.paymentService.payWithGiftCard(body.userId, body.giftCardCode);
      
      return {
        message: 'Gift card applied successfully',
        user,
      };
    } catch (error) {
      console.error('Error applying gift card:', error);
      throw new BadRequestException(error.message);
    }
  }

}
