import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  

  const config = new DocumentBuilder()
    .setTitle('Books API')
    .setDescription('API for managing books')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  //console.log(`Swagger está disponible en http://localhost:3000`);

  await app.listen(3000);
}
bootstrap();
