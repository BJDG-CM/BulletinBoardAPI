import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @ApiProperty({ description: '게시글 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '작성자 ID', example: 'user-1' })
  userId: string;

  @ApiProperty({ description: '게시글 제목', example: '안녕하세요:)' })
  title: string;

  @ApiProperty({ description: '게시글 내용', example: '반가워요!' })
  content: string;

  @ApiProperty({ description: '생성일', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정일', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}