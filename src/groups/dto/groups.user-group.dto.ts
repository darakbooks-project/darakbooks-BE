import { Groups } from '../entities/groups.entity';
import { PickType } from '@nestjs/swagger';

export class GroupsUserGroupDto extends PickType(Groups, [
  'userGroup',
] as const) {}
