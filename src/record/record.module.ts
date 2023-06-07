import { Module } from '@nestjs/common';
import { RecordService } from './service/record.service';
import { RecordController } from './controller/record.controller';
import { recordProviders } from './record.provider';
import { DatabaseModule } from 'src/database/database.module';
import { S3Service } from 'src/common/s3.service';
import { BookshelfService } from 'src/bookshelf/service/bookshelf.service';
import { bookProvider } from 'src/repositories/book.provider';
import { bookshelfProviders } from 'src/repositories/bookshelf.provider';
import { UserService } from 'src/user/service/user.service';
import { userProviders } from 'src/user/user.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RecordController],
  providers: [...recordProviders,...bookProvider,...bookshelfProviders,...userProviders,RecordService,S3Service,BookshelfService,UserService,]
})
export class RecordModule {}
