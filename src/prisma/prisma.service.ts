import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // 모듈이 초기화되면 Prisma에 연결
  async onModuleInit() {
    await this.$connect();
  }

  // 애플리케이션이 종료되면 Prisma 연결을 끊음
  async onModuleDestroy() {
    await this.$disconnect();
  }
}