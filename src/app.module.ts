import { AuthModule } from './auth/auth.module';
import { UserService } from './user/service/user.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RecordController } from './record/controller/record.controller';
import { RecordModule } from './record/record.module';
import configuration from './config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './exceptionFilter/notfound.filter';
import { BookshelfModule } from './bookshelf/bookshelf.module';
import { GroupsModule } from './groups/groups.module';
import { Module } from '@nestjs/common';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env/.env.${process.env.NODE_ENV || "development"}`,
    isGlobal: true, 
    load:[configuration]
  }), AuthModule, UserModule, RecordModule, DatabaseModule, BookshelfModule,GroupsModule,],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: NotFoundExceptionFilter,
  },],
})
export class AppModule {}
