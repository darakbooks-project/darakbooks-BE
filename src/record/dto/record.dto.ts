import { IsObject } from 'class-validator';
import { bookDTO } from './book.dto';
import { CreateRecordDTO } from './create-record.dto';

export class recordDTO{
    @IsObject()
    book : bookDTO; 

    @IsObject()
    record : CreateRecordDTO;

}