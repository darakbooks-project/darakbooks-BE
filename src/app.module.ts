import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RecordModule } from './record/record.module';
import configuration from './config/configuration';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env/.env.${process.env.NODE_ENV || "development"}`,
    isGlobal: true, 
    load:[configuration]
  }), 
  CacheModule.register({
    store: 'redis',
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
    isGlobal:true,
  }),
  AuthModule, UserModule, RecordModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
