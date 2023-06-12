import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Bookshelf } from 'src/entities/BookShelf.entity';

export class UpdateUserDTO{
    @IsOptional()
    @IsString()
    nickname  : string;

    @IsOptional()
    @IsString()
    photoId: string;

    @IsOptional()
    @IsString()
    photoUrl: string;

    @IsOptional()
    @IsString()
    userInfo  : string;

    @IsOptional()
    @IsBoolean()
    bookshelfIsHidden:boolean;
    
}