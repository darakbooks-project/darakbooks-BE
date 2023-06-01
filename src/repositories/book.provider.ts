
import { DataSource } from 'typeorm';
import { Book } from '../entities/Book.entity';

export const BookProvider = [
  {
    provide: 'BOOK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Book),
    inject: ['DATA_SOURCE'],
  },
];