import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GPTModule } from './gpt/gpt.module';
import { Module } from '@nestjs/common';
import { RecordController } from './record/controller/record.controller';
import { RecordModule } from './record/record.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/service/user.service';
import configuration from './config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './exceptionFilter/notfound.filter';
import { BookshelfModule } from './bookshelf/bookshelf.module';
import { GroupsModule } from './groups/groups.module';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env/.env.${process.env.NODE_ENV || "development"}`,
    isGlobal: true, 
    load:[configuration]
  }), AuthModule, UserModule, RecordModule, DatabaseModule, GPTModule, BookshelfModule,GroupsModule,],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: NotFoundExceptionFilter,
  },],
})
export class AppModule {}
