import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Record {
    @ApiProperty({ example: "쇼코의 미소" , description: '책 제목' })   
    @Column()
    title:string;

    @ApiProperty({ example: "thumnail url" , description:'kakao api에서 받은 책 사진' })   
    @Column()
    thumbnail:string;

    @ApiProperty({ example: '3983424490', description: 'bookIsbn' })
    @PrimaryColumn({name:'book_isbn'})
    bookIsbn: string;

}