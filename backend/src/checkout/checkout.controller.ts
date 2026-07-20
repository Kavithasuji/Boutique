import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { JwtCustomerGuard } from "../customer-auth/guards/jwt-customer.guard";

@Controller("checkout")
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
  ) {}

  @UseGuards(JwtCustomerGuard)
  @Get("summary")
  getSummary(
    @Req() req: any,
  ) {
    return this.checkoutService.getSummary(
      req.user.id,
    );
  }
}