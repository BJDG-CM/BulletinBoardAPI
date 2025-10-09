import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ description: '사용자 ID', example: 'user-1' })
  id: string;

  @ApiProperty({ description: '사용자 이름', example: 'jane_doe' })
  username: string;

  @ApiProperty({ description: '비밀번호', example: '$2b$10$...' })
  password: string;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}