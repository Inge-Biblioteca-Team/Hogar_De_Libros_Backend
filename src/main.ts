/* eslint-disable prettier/prettier */
//dejame hacer pr
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { SwaggerAuthInterceptor } from './Interceptors/SwaggerAuthInterceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
  });

  app.enableCors({
    origin: [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL2,
    ],
    credentials: true,
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Books API')
    .setDescription('API for managing books')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  app.useGlobalInterceptors(new SwaggerAuthInterceptor());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Swagger está disponible en http://localhost:3000/api`);

  const used = process.memoryUsage();
  console.log('Memory usage:');
  for (const key in used) {
    console.log(`${key} ${(used[key] / 1024 / 1024).toFixed(2)} MB`);
  }
}
bootstrap();
