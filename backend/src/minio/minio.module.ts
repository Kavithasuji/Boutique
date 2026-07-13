import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioProvider } from './minio.provider';
import { MinioService } from './minio.service';

@Module({
  imports: [ConfigModule],
  providers: [MinioProvider, MinioService],
  exports: [MinioService],
})
export class MinioModule {}