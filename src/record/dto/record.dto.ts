import { IsObject } from 'class-validator';
import { BookDTO } from '../../bookshelf/book.dto';
import { CreateRecordDTO } from './create-record.dto';

export class recordDTO{
    @IsObject()
    record : CreateRecordDTO;

}