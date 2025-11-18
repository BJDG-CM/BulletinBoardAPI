import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID (UUID)' })
  id: string;

  @ApiProperty({ description: 'IDP Sub' })
  sub: string;

  @ApiProperty({ description: '사용자 이름' })
  name: string;

  @ApiProperty({ description: '이메일', required: false })
  email?: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token', required: false })
  refreshToken?: string;

  @ApiProperty({ description: '토큰 타입', required: false })
  tokenType?: string;

  @ApiProperty({ description: '만료 시간(초)', required: false })
  expiresIn?: number;

  @ApiProperty({ description: '사용자 정보', type: UserResponseDto })
  user: UserResponseDto;
}
