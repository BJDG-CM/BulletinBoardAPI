import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '사용자 이름', example: 'jane_doe' })
  @IsString()
  @IsNotEmpty({ message: 'Error!: 사용자 이름을 입력해주세요.' })
  username: string;

  @ApiProperty({ 
    description: '비밀번호 (영문 대소문자, 숫자, 특수문자 포함 8자 이상)', 
    example: 'Password123!' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Error!: 비밀번호를 입력해주세요.' })
  password: string;
}