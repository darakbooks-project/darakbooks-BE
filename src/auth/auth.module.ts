import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'config/config';

@Module({
  imports: [
    UserModule, 
    PassportModule, 
    forwardRef(()=>UserModule),
    JwtModule.register({
    secret: config.jwt.jwtAccessSecret,
    signOptions: { expiresIn: `${config.jwt.accessExpiresInSec}s` },},),
    JwtModule.register({
      secret: config.jwt.jwtRefreshSecret,
      signOptions: { expiresIn: `${config.jwt.jwtRefreshSecret}s` },},),
    ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
