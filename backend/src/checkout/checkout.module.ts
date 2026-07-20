import { Module } from "@nestjs/common";

import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";

import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],

  controllers: [CheckoutController],

  providers: [CheckoutService],

  exports: [CheckoutService], // 👈 Make CheckoutService available to other modules
})
export class CheckoutModule {}