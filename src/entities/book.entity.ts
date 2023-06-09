import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { Bookshelf } from './BookShelf.entity';
import { Record } from 'src/record/record.entity';

@Entity()
export class Book {
    @ApiProperty({ example: "살인자의 기억법", description: '책 제목' })
    @Column()
    title:string;

    @ApiProperty({ example: "https://avostorage.s3.amazonaws.com/1684897517164_86", description: '책의 표지' })
    @Column()
    thumbnail:string;

    @ApiProperty({ example: "39834244", description: '책의 isbn 코드' })
    @PrimaryColumn({name:'book_isbn'})
    bookIsbn: string;

    @ApiProperty({ example: ["김영하",], description: '책의 작가' })
    @Column({ type: 'json', nullable: true })
    tags: string[] ;

    @OneToMany(() => Record, record => record.bookIsbn)
    records: Record[]; 

    @OneToMany(() => Bookshelf, bookshelf => bookshelf.book)
    bookshelves: Bookshelf[];
}