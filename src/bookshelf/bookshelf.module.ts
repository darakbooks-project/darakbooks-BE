import { Module } from '@nestjs/common';
import { BookshelfController } from './controller/bookshelf.controller';
import { DatabaseModule } from 'src/database/database.module';
import { bookshelfProviders } from 'src/repositories/bookshelf.provider';
import { bookProvider } from 'src/repositories/book.provider';
import { BookshelfService } from './service/bookshelf.service';
import { UserService } from 'src/user/service/user.service';
import { userProviders } from 'src/user/user.provider';
import { RecordService } from 'src/record/service/record.service';
import { recordProviders } from 'src/record/record.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [BookshelfController],
    providers: [...bookshelfProviders,...bookProvider,...userProviders,...recordProviders,BookshelfService,UserService,RecordService]
})
export class BookshelfModule {}
