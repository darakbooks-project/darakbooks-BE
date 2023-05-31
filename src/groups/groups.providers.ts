import { DataSource } from 'typeorm';
import { GroupEntity } from './entities/groups.entity';

export const groupsProviders = [
  {
    provide: 'GROUPS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GroupEntity),
    inject: ['DATA_SOURCE'],
  },
];
