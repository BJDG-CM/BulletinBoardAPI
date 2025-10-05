import { IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindPostParamDto {
  @ApiProperty({ description: '조회/수정/삭제할 게시글의 ID', example: '1' })
  @IsNumberString({}, { message: '게시글 ID는 숫자 형식이어야 합니다.' })
  @IsNotEmpty({ message: '게시글 ID를 입력해주세요.' })
  id: string;
}