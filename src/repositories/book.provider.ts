
import { Book } from 'src/entities/book.entity';
import { DataSource } from 'typeorm';


export const bookProvider = [
  {
    provide: 'BOOK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Book),
    inject: ['DATA_SOURCE'],
  },
];