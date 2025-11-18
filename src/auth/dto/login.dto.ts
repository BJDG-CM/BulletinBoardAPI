import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '인가 코드', example: 'auth-code-from-idp' })
  @IsString()
  @IsNotEmpty({ message: '인가 코드를 입력해주세요.' })
  code: string;

  @ApiProperty({ description: '리디렉션 URI', required: false })
  @IsOptional()
  @IsString()
  redirectUri?: string;
}
