import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, //DTO에 없는 속성 전달 시 에러
      transform: true, // 요청 데이터를 DTO 인스턴스로 자동 변환
    }),
  );
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();