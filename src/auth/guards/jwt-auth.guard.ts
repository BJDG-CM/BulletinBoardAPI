import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    const user = await this.authService.validateAccessToken(token);

    request.user = {
      userId: user.id,
      sub: user.sub,
      name: user.name,
      email: user.email,
      accessToken: token,
    };

    return true;
  }

  private extractToken(request: { headers?: Record<string, string> }): string {
    const authorization = request.headers?.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access Token이 필요합니다.');
    }
    return authorization.split(' ')[1];
  }
}

export default JwtAuthGuard;
