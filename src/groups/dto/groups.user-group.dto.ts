import { GroupEntity } from '../entities/groups.entity';
import { PickType } from '@nestjs/swagger';

export class GroupsUserGroupDto extends PickType(GroupEntity, [
  'group_lead',
  'userGroup',
] as const) {}
