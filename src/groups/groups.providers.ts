import { DataSource } from 'typeorm';
import { Groups } from './entities/groups.entity';

export const groupsProviders = [
  {
    provide: 'GROUPS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Groups),
    inject: ['DATA_SOURCE'],
  },
];
