import { ConfigModule } from '@nestjs/config';
import { cacheProvider } from './cache.providers';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule],
    providers: [cacheProvider],
    exports: ['CACHE_MANAGER'],
  })
  export class CacheModule {}