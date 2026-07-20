import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { CustomerAuthModule } from './customer-auth/customer-auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { AddressModule } from "./address/address.module";
import { CheckoutModule } from "./checkout/checkout.module";
import { PaymentModule } from './payment/payment.module';
import { OrdersModule } from './orders/orders.module';
import {AdminOrderModule} from './admin-order/admin-order.module'
import { AdminInventoryModule } from './admin-inventory/admin-inventory.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    PrismaModule,

    AdminAuthModule,
    CustomerAuthModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    AddressModule,
    CheckoutModule,
    PaymentModule,
    OrdersModule,
    AdminOrderModule,
    AdminInventoryModule,
    AdminDashboardModule,
    SearchModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}