/* eslint-disable prettier/prettier */
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
      'http://localhost',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5176',
      'https://hogar-de-libros-front-zer0.vercel.app',
      'https://front-inge-akion.vercel.app',
      'https://zcz17ld0-5173.use2.devtunnels.ms',
      'https://hogardelibroszero-production.up.railway.app',
      'https://hogar-de-libros-front-keirin.vercel.app',
      'https://hogar-de-libros-front-naza-g.vercel.app',
      'https://opac-hogar-libros.vercel.app',
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
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Swagger está disponible en http://localhost:3000/api`);
}
bootstrap();
