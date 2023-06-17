import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, IsArray } from 'class-validator';
import { recordDTO } from './record.dto';
import { BookDTO } from 'src/bookshelf/book.dto';

export class CreateRecordDTO {
  @ApiProperty({ description: 'Book information' })
  book: BookDTO;
  @ApiProperty({ description: 'Record information' })
  record : recordDTO;
}