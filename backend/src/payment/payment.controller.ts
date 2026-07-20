import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';

import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

import { JwtCustomerGuard } from 'src/customer-auth/guards/jwt-customer.guard';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create-order')
  @UseGuards(JwtCustomerGuard)
  async createOrder(@Req() req: any) {
    return this.paymentService.createOrder(req.user.id);
  }

@Post("verify")
@UseGuards(JwtCustomerGuard)
verifyPayment(
  @Req() req,
  @Body() dto: VerifyPaymentDto,
) {
  return this.paymentService.verifyPayment(
    req.user.id,
    dto,
  );
}

@Post("webhook")
async webhook(
  @Req() req: any,
  @Headers("x-razorpay-signature") signature: string,
) {
  console.log("Webhook received");
  console.log(signature);

  return this.paymentService.handleWebhook(
    req.rawBody,
    signature,
  );
}
}