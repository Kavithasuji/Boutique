import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { AdminInventoryService } from './admin-inventory.service';

import { GetInventoryDto } from './dto/get-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('admin/inventory')
export class AdminInventoryController {
  constructor(
    private readonly adminInventoryService: AdminInventoryService,
  ) {}

  @Get()
  getInventory(
    @Query() query: GetInventoryDto,
  ) {
    return this.adminInventoryService.getInventory(
      query,
    );
  }

  @Get(':id')
  getInventoryById(
    @Param('id') id: string,
  ) {
    return this.adminInventoryService.getInventoryById(
      id,
    );
  }

  @Patch(':id')
  updateInventory(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.adminInventoryService.updateInventory(
      id,
      dto,
    );
  }
}