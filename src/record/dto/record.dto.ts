import { IsObject } from 'class-validator';
import { bookDTO } from '../../bookshelf/book.dto';
import { CreateRecordDTO } from './create-record.dto';

export class recordDTO{
    @IsObject()
    record : CreateRecordDTO;

}