import { DataSource } from 'typeorm';
import { UserGroup } from './entities/user-group.entity';

export const usergroupProviders = [
  {
    provide: 'USER_GROUP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserGroup),
    inject: ['DATA_SOURCE'],
  },
];
