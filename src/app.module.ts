import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/service/user.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env/.env.${process.env.NODE_ENV || "development"}`,
    isGlobal: true, 
    load:[configuration]
  }), AuthModule, UserModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
