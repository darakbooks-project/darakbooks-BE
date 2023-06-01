import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RecordModule } from './record/record.module';
import { BookshelfController } from './bookshelf/bookshelf.controller';
import { BookshelfService } from './bookshelf/bookshelf.service';
import { BookshelfModule } from './bookshelf/bookshelf.module';
import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env/.env.${process.env.NODE_ENV || "development"}`,
    isGlobal: true, 
    load:[configuration]
  }), 
  AuthModule, UserModule, RecordModule, DatabaseModule, BookshelfModule,],
  controllers: [BookshelfController],
  providers: [BookshelfService],
})
export class AppModule {}
