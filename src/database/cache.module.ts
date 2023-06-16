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
          host: configService.get('cache.host'),
          port: configService.get('cache.port'),
          password:configService.get('cache.password'),
          ttls:configService.get('cache.ttls') ,
      }),
      inject: [ConfigService], // ConfigService 주입,
  }),
  
  ],
})
export class CacheConfigModule {}