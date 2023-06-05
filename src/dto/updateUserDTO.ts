import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Bookshelf } from 'src/entities/BookShelf.entity';

export class UpdateUserDTO{
    @IsOptional()
    @IsString()
    nickname  : string;

    @IsOptional()
    @IsString()
    profileImg: string;

    @IsOptional()
    @IsString()
    userInfo  : string;

    @IsOptional()
    @IsBoolean()
    bookshelfIsHidden:boolean;

    @IsOptional()
    @IsBoolean()
    groupIsHidden:boolean;

    @IsOptional()
    @IsArray()
    bookshelves: Bookshelf[];
    
}