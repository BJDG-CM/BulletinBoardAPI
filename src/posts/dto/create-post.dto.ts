import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Error!: 작성자 ID를 입력해주세요.'})
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Error!: 게시글 제목을 입력해주세요.'})
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Error!: 게시글 내용을 입력해주세요.'})
  content: string;
}