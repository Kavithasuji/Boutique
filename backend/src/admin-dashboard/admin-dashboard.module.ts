import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';

@Module({
  controllers: [AdminDashboardController],

  providers: [
    AdminDashboardService,
    PrismaService,
  ],
})
export class AdminDashboardModule {}