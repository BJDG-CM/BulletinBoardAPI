import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // 모듈이 초기화되면 Prisma에 연결
  async onModuleInit() {
    await this.$connect();
  }

  // 모듈이 파괴되기 전에 Prisma 연결 종료
  async onModuleDestroy() {
    await this.$disconnect();
  }
}