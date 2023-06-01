import { IsArray, IsString } from 'class-validator';

export class BookDTO {
    @IsString()
    bookIsbn: string;
  
    @IsString()
    title: string;
  
    @IsArray()
    thumbnail: string;

}
