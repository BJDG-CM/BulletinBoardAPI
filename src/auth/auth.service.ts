import { Injectable } from '@nestjs/common';
import { AuthRepository } from './repositories/auth.repository';
import { IdpService, TokenResponse } from './idp.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly idpService: IdpService,
  ) {}

  async login(loginDto: LoginDto) {
    const tokenResponse = await this.idpService.requestToken(
      loginDto.code,
      loginDto.redirectUri,
    );

    const userInfo = await this.idpService.fetchUserInfo(
      tokenResponse.access_token,
    );

    const user = await this.authRepository.upsertIdpUser(userInfo);

    return this.buildLoginResponse(tokenResponse, user.id, userInfo);
  }

  async validateAccessToken(accessToken: string) {
    const userInfo = await this.idpService.fetchUserInfo(accessToken);
    return this.authRepository.upsertIdpUser(userInfo);
  }

  async logout(accessToken: string) {
    // 토큰 검증을 한 번 더 수행하여 유효한 요청인지 확인
    await this.idpService.fetchUserInfo(accessToken);
  }

  private buildLoginResponse(
    tokenResponse: TokenResponse,
    userId: string,
    userInfo: { sub: string; name: string; email?: string },
  ) {
    return {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenType: tokenResponse.token_type,
      expiresIn: tokenResponse.expires_in,
      user: {
        id: userId,
        sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
      },
    };
  }
}
