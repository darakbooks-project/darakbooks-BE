import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GroupsModule } from './groups/groups.module';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env/.env.${process.env.NODE_ENV || "development"}`,
    isGlobal: true, 
    load:[configuration]
  }),  DatabaseModule, GroupsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
