import { PickType } from '@nestjs/swagger';
import { Groups } from '../entities/groups.entity';

export class GroupsCreateDto extends PickType(Groups, [
  'name',
  'meeting_type',
  'open_chat_link',
  'participant_limit',
  'recruitment_status',
  'region',
  'representative_image',
] as const) {}
