import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtCustomerGuard } from 'src/customer-auth/guards/jwt-customer.guard';

import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}
  @UseGuards(JwtCustomerGuard)
  @Get()
  getMyOrders(@Req() req) {
    return this.ordersService.getMyOrders(
      req.user.id,
    );
  }
}