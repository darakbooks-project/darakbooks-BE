import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {ConfigService} from '@nestjs/config' ;
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt-refresh') {
  constructor(
    readonly configService : ConfigService,
    readonly authService:AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.jwtRefreshSecret')
    });
  }

  async validate(payload: any) {
    const userId = payload.userId ;
    await this.authService.validateRefresh(userId);
    return userId;
  }
}