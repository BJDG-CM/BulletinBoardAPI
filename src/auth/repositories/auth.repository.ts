import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IdpUserInfo } from '../idp.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertIdpUser(userInfo: IdpUserInfo) {
    try {
      return await this.prisma.user.upsert({
        where: { sub: userInfo.sub },
        update: {
          name: userInfo.name,
          email: userInfo.email,
        },
        create: {
          sub: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 등록된 사용자 이메일입니다.');
      }
      throw error;
    }
  }

  async findBySub(sub: string) {
    return this.prisma.user.findUnique({ where: { sub } });
  }
}
