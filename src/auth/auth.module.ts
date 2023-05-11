import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { kakaoStrategy } from './kakao/kakao.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/user/user.provider';

@Module({
  imports: [
    PassportModule, 
    forwardRef(()=>UserModule),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject : [ConfigService],
      useFactory: async(configService:ConfigService)=>({
        secret:configService.get('jwt.jwtAccessSecret')
      })
    }),
    DatabaseModule,
  ],
  providers: [AuthService,JwtStrategy,kakaoStrategy,...userProviders,],
  exports: [AuthService,PassportModule,JwtModule]
})
export class AuthModule {}
