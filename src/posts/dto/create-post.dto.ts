import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

  @ApiProperty({ description: '게시글 제목', example: '새로운 게시글 제목' })
  @IsString()
  @IsNotEmpty({ message: '게시글 제목을 입력해주세요.' })
  title: string;

  @ApiProperty({ description: '게시글 내용', example: '여기에 게시글 내용을 작성합니다.' })
  @IsString()
  @IsNotEmpty({ message: '게시글 내용을 입력해주세요.' })
  content: string;
  
  @ApiProperty({ description: '카테고리 ID', example: 1 })
  @IsInt()
  @Min(1)
  categoryId: number;
}