import { Request, Response } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserSessionDto } from 'src/dto/user.session.dto';

/**
 * (사전에 인증받았다고 가정한) 사용자 정보를 이용해 JWT 토큰을 발급하여 쿠키에 삽입합니다.
 * passport-jwt와는 독립적인 Guard입니다.
 */
@Injectable()
export class JWTSignGuard implements CanActivate {
  private logger = new Logger(JWTSignGuard.name);

  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    return this.generateJWTToken(req, res);
  }

  private generateJWTToken(request: Request, response: Response): boolean {
    const user = request.user as UserSessionDto | undefined;
    if (user === undefined) {
      this.logger.debug(`can't generate JWTToken`);
      return false;
    }
    const token = this.jwtService.sign(user);
    this.logger.debug(`generete ${user.intra_id}'s token`);
    response.cookie('accessToken', token);
    return true;
  }
}
