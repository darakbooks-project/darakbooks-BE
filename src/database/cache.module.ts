import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
// if you use redis
      useFactory: async (configService: ConfigService) => ({
          store: redisStore as any,
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password:configService.get('redis.password'),
          ttls:311040000 ,
      }),
      inject: [ConfigService], // ConfigService 주입,
  }),
  
  ],
})
export class CacheConfigModule {}