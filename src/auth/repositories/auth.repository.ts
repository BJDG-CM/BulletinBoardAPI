import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(username: string, password: string) {
    // 중복 체크
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Error!: 이미 존재하는 사용자 이름입니다.');
    }

    // 비밀번호 강도 검증
    this.validatePasswordStrength(password);

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { username, password: hashedPassword },
    });
  }

  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    try {
      return await this.prisma.refreshToken.create({
        data: { userId, token, expiresAt },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error!: Refresh Token 저장 중 오류가 발생했습니다.');
    }
  }

  async findRefreshToken(token: string) {
    try {
      return await this.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });
    } catch (error) {
      return null;
    }
  }

  async deleteRefreshToken(token: string) {
    try {
      await this.prisma.refreshToken.delete({ where: { token } });
    } catch (error) {
      // Token이 이미 삭제되었거나 존재하지 않는 경우 무시
    }
  }

  async deleteAllUserRefreshTokens(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  private validatePasswordStrength(password: string): void {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLengthValid = password.length >= 8;

    if (!isLengthValid || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      throw new ConflictException(
        'Error!: 비밀번호는 최소 8자 이상이며, 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.'
      );
    }
  }
}
