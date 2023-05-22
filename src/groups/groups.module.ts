import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GroupsController } from './groups.controller';
import { groupsProviders } from './groups.providers';
import { GroupsService } from './groups.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GroupsController],
  providers: [GroupsService, ...groupsProviders],
})
export class GroupsModule {}
