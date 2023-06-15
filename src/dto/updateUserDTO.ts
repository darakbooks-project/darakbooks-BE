import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Bookshelf } from 'src/entities/BookShelf.entity';

export class UpdateUserDTO{
    @ApiProperty({
        example: '민아',
        description: 'user 닉네임',
    })
    @IsOptional()
    @IsString()
    nickname  : string;

    @ApiProperty({
        example: '2039840298420',
        description: '프로필 사진 key',
    })
    @IsOptional()
    @IsString()
    photoId: string;

    @ApiProperty({
        example: 'profile_img path',
        description: '프로필 사진',
      })
    @IsOptional()
    @IsString()
    photoUrl: string;

    @ApiProperty({
        example: '책 읽는걸 좋아해요~~',
        description: 'user 설명',
    })
    @IsOptional()
    @IsString()
    userInfo  : string;

    @ApiProperty({
        example: 'true',
        description: 'true일 때 마이서재 비공개, false일때 마이서재공개',
    })
    @IsOptional()
    @IsBoolean()
    bookshelfIsHidden:boolean;
    
}