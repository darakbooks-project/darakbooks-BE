
import { DataSource } from 'typeorm';
import { Bookshelf } from '../entities/BookShelf.entity';

export const userProviders = [
  {
    provide: 'BOOKSHELF_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Bookshelf),
    inject: ['DATA_SOURCE'],
  },
];