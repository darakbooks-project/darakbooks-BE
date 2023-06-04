import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class BookDTO {
    @ApiProperty({ example: '8996991341', description: 'bookIsbn' })
    @IsString()
    bookIsbn: string;
    
    @ApiProperty({ example: '미움 받을 용기', description: '책 제목' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1467038', description: '책 사진 URL' })  
    @IsArray()
    thumbnail: string;

}
