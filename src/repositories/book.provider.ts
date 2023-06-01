
import { DataSource } from 'typeorm';
import { Book } from '../entities/Book.entity';

export const userProviders = [
  {
    provide: 'BOOK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Book),
    inject: ['DATA_SOURCE'],
  },
];