import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Express } from 'express';

import { UploadedFile } from '../common/interfaces/uploaded-file.interface';@Injectable()
export class MinioService implements OnModuleInit {
  private readonly bucketName: string;

  constructor(
    @Inject('MINIO_CLIENT')
    private readonly client: Client,

    private readonly configService: ConfigService,
  ) {
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET')!;
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucketName);

    if (!exists) {
      await this.client.makeBucket(this.bucketName);
      console.log(` Bucket "${this.bucketName}" created`);
    }
  }

async uploadFile(
  file: UploadedFile,
  folder = '',
): Promise<string> {
    try {
      const extension = path.extname(file.originalname);

      const fileName = `${randomUUID()}${extension}`;

      const objectName = folder
        ? `${folder}/${fileName}`
        : fileName;

      await this.client.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return objectName;
    } catch (error) {
      throw new InternalServerErrorException(
        'Image upload failed',
      );
    }
  }

  getFileUrl(objectName: string): string {
    const endpoint =
      this.configService.get<string>('MINIO_ENDPOINT');

    const port =
      this.configService.get<string>('MINIO_PORT');

    return `http://${endpoint}:${port}/${this.bucketName}/${objectName}`;
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.client.removeObject(
      this.bucketName,
      objectName,
    );
  }
}