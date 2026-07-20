import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
const app = await NestFactory.create(AppModule, {
  rawBody: true,
});
  app.use(helmet());
  app.use(cookieParser());

// app.enableCors({
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:5174',
//     'https://vvvm78nv-5173.inc1.devtunnels.ms',
//   ],
//   credentials: true,
// });
app.enableCors({
  origin: true,
  credentials: true,
});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Register Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Cupidanza Boutique API')
    .setDescription('REST API Documentation for Cupidanza Boutique')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
    // await app.listen(port);


await app.listen(port, '0.0.0.0');
  // console.log(` Server running on http://localhost:${port}`);
  // console.log(`Swagger UI: http://localhost:${port}/api`);
}

bootstrap();