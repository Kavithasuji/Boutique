import { Module } from '@nestjs/common';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CheckoutModule } from 'src/checkout/checkout.module';

@Module({
  imports: [
    PrismaModule,
    CheckoutModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}