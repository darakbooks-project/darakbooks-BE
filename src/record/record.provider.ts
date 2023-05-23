
import { DataSource } from 'typeorm';
import { Record } from './record.entity';

export const recordProviders = [
  {
    provide: 'RECORD_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Record),
    inject: ['DATA_SOURCE'],
  },
];