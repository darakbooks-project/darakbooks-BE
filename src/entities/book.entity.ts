import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { Bookshelf } from './BookShelf.entity';

@Entity()
export class Book {
    @ApiProperty({ example: "쇼코의 미소" , description: '책 제목' })   
    @Column()
    title:string;

    @ApiProperty({ example: "thumnail url" , description:'kakao api에서 받은 책 사진' })   
    @Column()
    thumbnail:string;

    @ApiProperty({ example: '3983424490', description: 'bookIsbn' })
    @PrimaryColumn({name:'book_isbn'})
    bookIsbn: string;

        
    @OneToMany(() => Bookshelf, bookshelf => bookshelf.book)
    bookshelves: Bookshelf[];
    
    @ManyToMany(()=>User, user=>user.books)
    users:User[];

    
}