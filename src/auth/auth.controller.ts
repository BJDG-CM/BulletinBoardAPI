import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { LoginResponseDto, UserResponseDto, RefreshTokenResponseDto } from './dto/auth-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공', type: UserResponseDto })
  @ApiResponse({ status: 409, description: '중복된 사용자 이름 또는 비밀번호 규칙 위반' })
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.authService.register(registerDto);
    return ApiResponseDto.success(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Request() req): Promise<ApiResponseDto<LoginResponseDto>> {
    const tokens = await this.authService.login(req.user);
    return ApiResponseDto.success(tokens);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Access Token 재발급' })
  @ApiResponse({ status: 200, description: '토큰 재발급 성공', type: RefreshTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Refresh Token 무효' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
    const result = await this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
    return ApiResponseDto.success(result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @ApiResponse({ status: 401, description: '유효하지 않은 Refresh Token' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<ApiResponseDto<{ message: string }>> {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return ApiResponseDto.success({ message: '로그아웃 되었습니다.' });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}


  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {

    return this.authService.googleLogin(req.user);
  }
}