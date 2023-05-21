import { IsString, IsNumber, IsDate, IsOptional, IsArray } from 'class-validator';
import { bookDTO } from './book.dto';

export class CreateRecordDTO {
  @IsString()
  bookIsbn: string;

  @IsString()
  text: string;

  @IsString()
  recordImg: string;

  @IsOptional()
  @IsArray()
  tags: { id: number, data: string }[] ;

  @IsString()
  userId: string;

  @IsString()
  readAt: string;


}

