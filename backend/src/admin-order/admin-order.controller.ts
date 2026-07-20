import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { AdminOrderService } from './admin-order.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';


@Controller('admin/orders')
export class AdminOrderController {
  constructor(
    private readonly adminOrderService: AdminOrderService,
  ) {}

  // -----------------------------
  // Get All Orders
  // -----------------------------
  @Get()
  getOrders(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('status') status = '',
  ) {
    return this.adminOrderService.getOrders(
      Number(page),
      Number(limit),
      search,
      status,
    );
  }

  // -----------------------------
  // Get Order Details
  // -----------------------------
  @Get(':id')
  getOrderById(
    @Param('id') id: string,
  ) {
    return this.adminOrderService.getOrderById(id);
  }

  // -----------------------------
  // Update Order Status
  // -----------------------------
@Patch(':id/status')
updateOrderStatus(
  @Param('id') id: string,
  @Body() dto: UpdateOrderStatusDto,
) {
  return this.adminOrderService.updateOrderStatus(
    id,
    dto.status,
  );
}
}