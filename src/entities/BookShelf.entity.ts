import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Bookshelf {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookshelves)
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Book, book => book.bookshelves)
  @Column({ name: 'book_isbn' })
  bookIsbn: string;
}