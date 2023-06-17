import { ConfigService } from '@nestjs/config';
import { Bookshelf } from 'src/entities/BookShelf.entity';
import { Book } from 'src/entities/book.entity';
import { Record } from 'src/record/record.entity';
import { UserGroup } from 'src/user-group/entities/user-group.entity';
import { User } from 'src/user/user.entity';
import { DataSource } from 'typeorm';
import { GroupEntity } from 'src/groups/entities/groups.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.name'),
        entities: [User,Record,Book,Bookshelf,UserGroup,GroupEntity],
        synchronize: true, //나중에 바꾸기. 
      });

      return dataSource.initialize();
    },
    inject: [ConfigService], // ConfigService 주입
  },
];