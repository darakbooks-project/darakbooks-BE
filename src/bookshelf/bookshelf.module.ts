import { Module } from '@nestjs/common';
import { BookshelfController } from './controller/bookshelf.controller';
import { DatabaseModule } from 'src/database/database.module';
import { bookshelfProviders } from 'src/repositories/bookshelf.provider';
import { BookProvider } from 'src/repositories/book.provider';
import { BookshelfService } from './service/bookshelf.service';
import { UserService } from 'src/user/service/user.service';
import { userProviders } from 'src/user/user.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [BookshelfController],
    providers: [...bookshelfProviders,...BookProvider,...userProviders,BookshelfService,UserService,]
})
export class BookshelfModule {}
