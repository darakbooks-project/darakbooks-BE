import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { Bookshelf } from './BookShelf.entity';

@Entity()
export class Book {
    @Column()
    title:string;

    @Column()
    thumbnail:string;

    @PrimaryColumn({name:'book_isbn'})
    bookIsbn: string;
        
    @OneToMany(() => Bookshelf, bookshelf => bookshelf.book)
    bookshelves: Bookshelf[];
    
    
}