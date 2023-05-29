import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GroupsModule } from './groups/groups.module';
import { Module } from '@nestjs/common';
import { RecordController } from './record/controller/record.controller';
import { RecordModule } from './record/record.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/service/user.service';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env/.env.${process.env.NODE_ENV || "development"}`,
    isGlobal: true, 
    load:[configuration]
  }), AuthModule, UserModule, DatabaseModule, GroupsModule,RecordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
