import { GroupEntity } from '../entities/groups.entity';
import { PickType } from '@nestjs/swagger';

export class GroupsCreateDto extends PickType(GroupEntity, [
  'name',
  'meeting_type',
  'open_chat_link',
  'participant_limit',
  'recruitment_status',
  'region',
  'description',
  'group_lead',
  'userGroup',
] as const) {}
