import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

export const MinioProvider = {
  provide: 'MINIO_CLIENT',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Client({
      endPoint: configService.get<string>('MINIO_ENDPOINT')!,
      port: Number(configService.get<string>('MINIO_PORT')),
      useSSL: configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: configService.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: configService.get<string>('MINIO_SECRET_KEY')!,
    });
  },
};