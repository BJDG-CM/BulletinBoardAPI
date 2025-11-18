import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ description: '게시글 제목', example: '수정된 게시글 제목', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: '게시글 내용', example: '수정된 게시글 내용', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '카테고리 ID', example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;
}