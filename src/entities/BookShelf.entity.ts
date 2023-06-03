import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Bookshelf {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookshelves)
  user: User;

  @ManyToOne(() => Book, book => book.bookshelves)
  book: Book;
}