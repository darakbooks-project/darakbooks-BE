import { IsString, IsNumber, IsDate, IsOptional, IsArray } from 'class-validator';

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
  readAt: string;

  userId: string;

}

