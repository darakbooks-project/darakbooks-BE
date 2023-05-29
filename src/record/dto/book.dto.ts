import { IsArray, IsString } from 'class-validator';


export class bookDTO {
    @IsString()
    bookIsbn: string;
  
    @IsString()
    title: string;
  
    @IsArray()
    authors: string[];
  
    @IsString()
    publisher: string;
  
    @IsString()
    thumbnail: string;
}
