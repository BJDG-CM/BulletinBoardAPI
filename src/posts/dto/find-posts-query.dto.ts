import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindPostsQueryDto {
  @ApiProperty({
    description: '특정 사용자의 게시글만 조회할 경우 사용',
    example: 'user-1',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}