import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import {config} from 'dotenv';
declare const module: any;


async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule, 
    {
      cors:{
        origin:process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'] ,
        credentials:true,
        
      }
    });
  console.log(process.env.CORS_ORIGIN, process.env.PORT);
  app.use(cookieParser());

  const swagger = new DocumentBuilder()
    .setTitle('다락책방 백엔드 API | DarakBooks Backend API')
    .setDescription(
      '다락책방 백엔드 독서 API 입니다. 로그인, 독서모임, 마이페이지, 책장추천, 독서기록, GPT 독서추천서비스를 제공하고 있습니다. | This is the backend API for DarakBooks. We are offering login, book clubs, my page, bookshelf recommendation, and GPT Book Recommendation Services.',
    )
    .setVersion('1.0.0')
    .addBasicAuth(
      {
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('docs', app, document);
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
  await app.listen(process.env.PORT);
}
bootstrap();
