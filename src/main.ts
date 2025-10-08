import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, //DTO에 없는 속성 전달 시 에러
      transform: true, // 요청 데이터를 DTO 인스턴스로 자동 변환
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('게시판 API 명세서')
    .setDescription('NestJS로 만든 게시판 API')
    .setVersion('1.0')
    .addTag('Posts', '게시글 관련 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 'api-docs' 경로에서 Swagger UI 제공

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is available at: http://localhost:${port}/api-docs`);
}
bootstrap();