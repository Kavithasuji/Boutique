import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { UpdateCartDto } from "./dto/update-cart.dto";
import { CartService } from "./cart.service";
import { AddCartDto } from "./dto/add-cart.dto";
import { JwtCustomerGuard } from "../customer-auth/guards/jwt-customer.guard";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtCustomerGuard)
  @Post()
  async addToCart(
    @Req() req: any,
    @Body() dto: AddCartDto,
  ) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @UseGuards(JwtCustomerGuard)
@Get()
async getCart(@Req() req: any) {
  return this.cartService.getCart(req.user.id);
}

@UseGuards(JwtCustomerGuard)
@Patch(":id")
updateQuantity(
  @Req() req: any,
  @Param("id") id: string,
  @Body() dto: UpdateCartDto,
) {
  return this.cartService.updateQuantity(
    req.user.id,
    id,
    dto.quantity,
  );
}

@UseGuards(JwtCustomerGuard)
@Delete(":id")
removeItem(
  @Req() req: any,
  @Param("id") id: string,
) {
  return this.cartService.removeItem(
    req.user.id,
    id,
  );
}
}