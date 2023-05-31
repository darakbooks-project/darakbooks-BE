import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Module } from '@nestjs/common';
import { groupsProviders } from './groups.providers';
@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [GroupsController],
  providers: [GroupsService, ...groupsProviders],
})
export class GroupsModule {}
