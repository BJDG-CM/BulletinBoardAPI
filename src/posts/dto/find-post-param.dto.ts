import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindPostParamDto {
  @IsNotEmpty({ message: 'Error!: 게시글 ID를 입력해주세요.' })
  @IsNumberString({}, { message: 'Error!: 게시글 ID는 숫자여야 합니다.' })
  @Transform(({ value }) => parseInt(value))
  id: number;
}