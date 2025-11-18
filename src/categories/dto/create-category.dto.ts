import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '카테고리 이름', example: 'announcement' })
  @IsString()
  @IsNotEmpty({ message: '카테고리 이름을 입력해주세요.' })
  @MaxLength(50)
  name: string;
}
