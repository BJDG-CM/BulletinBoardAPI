import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './repositories/auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, UserResponseDto, RefreshTokenResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.authRepository.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Error!: 사용자 이름 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await this.authRepository.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Error!: 사용자 이름 또는 비밀번호가 올바르지 않습니다.');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any): Promise<LoginResponseDto> {
    // 기존 Refresh Token 삭제 (중복 로그인 방지)
    await this.authRepository.deleteAllUserRefreshTokens(user.id);

    const accessToken = this.generateAccessToken(user.id, user.username);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const user = await this.authRepository.createUser(
      registerDto.username,
      registerDto.password,
    );

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    const tokenData = await this.authRepository.findRefreshToken(refreshToken);

    if (!tokenData) {
      throw new UnauthorizedException('Error!: 유효하지 않은 Refresh Token입니다.');
    }

    if (new Date() > tokenData.expiresAt) {
      await this.authRepository.deleteRefreshToken(refreshToken);
      throw new UnauthorizedException('Error!: Refresh Token이 만료되었습니다.');
    }

    const accessToken = this.generateAccessToken(tokenData.userId, tokenData.user.username);

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenData = await this.authRepository.findRefreshToken(refreshToken);
    
    if (!tokenData) {
      throw new UnauthorizedException('Error!: 유효하지 않은 Refresh Token입니다.');
    }

    await this.authRepository.deleteRefreshToken(refreshToken);
  }

  private generateAccessToken(userId: string, username: string): string {
    const payload = { sub: userId, username };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.saveRefreshToken(userId, token, expiresAt);

    return token;
  }
}