import { ConfigService } from '@nestjs/config';

export const cacheProvider = {
  provide: 'CACHE_MANAGER',
  useFactory: async (configService: ConfigService) => ({
    store: 'redis',
    host: configService.get('redis.host'),
    port: configService.get('redis.port'),
    password: configService.get('redis.password'),
  }),
  inject: [ConfigService],
};