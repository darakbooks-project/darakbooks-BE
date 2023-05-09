import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule, 
    PassportModule, 
    ConfigModule,
    forwardRef(()=>UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject : [ConfigService],
      useFactory: async(configService:ConfigService)=>({
        secret:configService.get('jwt.accessExpiresInSec')
      })
    })],
  providers: [AuthService, LocalStrategy,JwtStrategy,],
  exports: [AuthService]
})
export class AuthModule {}
