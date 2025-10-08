import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '작성자 ID', example: 'user-1' })
  @IsString()
  @IsNotEmpty({ message: '작성자 ID를 입력해주세요.' })
  userId: string;

  @ApiProperty({ description: '게시글 제목', example: '새로운 게시글 제목' })
  @IsString()
  @IsNotEmpty({ message: '게시글 제목을 입력해주세요.' })
  title: string;

  @ApiProperty({ description: '게시글 내용', example: '여기에 게시글 내용을 작성합니다.' })
  @IsString()
  @IsNotEmpty({ message: '게시글 내용을 입력해주세요.' })
  content: string;
}