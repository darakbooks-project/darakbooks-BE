import { Groups } from '../entities/groups.entity';
import { PickType } from '@nestjs/swagger';

export class GroupsCreateDto extends PickType(Groups, [
  'name',
  'meeting_type',
  'open_chat_link',
  'participant_limit',
  'recruitment_status',
  'region',
  'description',
  'userGroup',
] as const) {}
