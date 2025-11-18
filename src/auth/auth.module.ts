import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IdpService } from './idp.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtAuthGuard, IdpService],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}

