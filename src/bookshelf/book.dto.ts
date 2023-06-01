import { IsArray, IsString } from 'class-validator';


export class bookDTO {
    @IsString()
    bookIsbn: string;
  
    @IsString()
    title: string;
  
    @IsArray()
    thumbnail: string;

}
