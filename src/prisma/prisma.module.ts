import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // PrismaModule을 모든 모듈에서 가져올 필요 없이 사용 가능하게 함
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 다른 모듈에서 PrismaService를 주입받아 사용할 수 있게 함
})
export class PrismaModule {}