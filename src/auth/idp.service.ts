import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

interface IdpUserInfo {
  sub: string;
  name: string;
  email?: string;
}

@Injectable()
export class IdpService {
  constructor(private readonly configService: ConfigService) {}

  private get baseUrl(): string {
    const baseUrl = this.configService.get<string>('IDP_BASE_URL');
    if (!baseUrl) {
      throw new InternalServerErrorException('IDP_BASE_URL 환경변수가 설정되지 않았습니다.');
    }
    return baseUrl.replace(/\/$/, '');
  }

  async requestToken(code: string, redirectUri?: string): Promise<TokenResponse> {
    const clientId = this.configService.get<string>('IDP_CLIENT_ID');
    const clientSecret = this.configService.get<string>('IDP_CLIENT_SECRET');
    const fallbackRedirect = this.configService.get<string>('IDP_REDIRECT_URI');
    const requestRedirectUri = redirectUri || fallbackRedirect;

    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException('IDP 클라이언트 설정이 누락되었습니다.');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
    });

    if (requestRedirectUri) {
      body.append('redirect_uri', requestRedirectUri);
    }

    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new UnauthorizedException('IDP 토큰 발급에 실패했습니다.');
    }

    const payload = (await response.json()) as Partial<TokenResponse>;
    if (!payload.access_token) {
      throw new BadRequestException('IDP 응답에 access_token이 없습니다.');
    }

    return payload as TokenResponse;
  }

  async fetchUserInfo(accessToken: string): Promise<IdpUserInfo> {
    const response = await fetch(`${this.baseUrl}/oauth/userInfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new UnauthorizedException('IDP 액세스 토큰 검증에 실패했습니다.');
    }

    const payload = (await response.json()) as Partial<IdpUserInfo>;
    if (!payload.sub || !payload.name) {
      throw new BadRequestException('IDP 사용자 정보 응답이 올바르지 않습니다.');
    }

    return payload as IdpUserInfo;
  }
}
export type { TokenResponse, IdpUserInfo };