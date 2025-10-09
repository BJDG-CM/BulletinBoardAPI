import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID', example: 'user-uuid' })
  id: string;

  @ApiProperty({ description: '사용자 이름', example: 'jane_doe' })
  username: string;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token' })
  refreshToken: string;

  @ApiProperty({ description: '사용자 정보', type: UserResponseDto })
  user: UserResponseDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ description: '새로운 Access Token' })
  accessToken: string;
}
