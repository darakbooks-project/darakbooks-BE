import { IsString, IsNumber, IsDate, IsOptional, IsArray } from 'class-validator';

export class CreateRecordDTO {
  
  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsString()
  bookIsbn: string;

  @IsString()
  text: string;

  @IsString()
  recordImg: string;

  @IsString()
  recordImgUrl: string;

  @IsOptional()
  @IsArray()
  tags: { id: number, data: string }[] ;

  @IsString()
  readAt: string;

  userId: string;

}

