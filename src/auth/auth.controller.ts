import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { LoginResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'IDP 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<LoginResponseDto>> {
    const response = await this.authService.login(loginDto);
    return ApiResponseDto.success(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃 (토큰 검증)' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(@Request() req): Promise<ApiResponseDto<{ message: string }>> {
    await this.authService.logout(req.user.accessToken);
    return ApiResponseDto.success({ message: '로그아웃 되었습니다.' });
  }
}
