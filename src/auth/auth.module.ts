import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { kakaoStrategy } from './kakao/kakao.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/user/user.provider';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheConfigModule } from 'src/database/cache.module';

@Module({
  imports: [
    PassportModule, 
    forwardRef(()=>UserModule),
    ConfigModule,
    JwtModule.register({}),
    DatabaseModule,
  ],
  providers: [AuthService,JwtStrategy,kakaoStrategy,...userProviders,],
  exports: [AuthService,PassportModule,JwtModule,]
})
export class AuthModule {}
