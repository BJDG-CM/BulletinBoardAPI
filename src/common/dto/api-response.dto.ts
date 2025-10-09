import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: '요청 성공 여부' })
  success: boolean;

  @ApiProperty({ description: '응답 데이터' })
  data?: T;

  @ApiProperty({ description: '에러 메시지', required: false })
  error?: string;

  constructor(success: boolean, data?: T, error?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T): ApiResponseDto<T> {
    return new ApiResponseDto(true, data);
  }

  static error(message: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, null, message);
  }
}
