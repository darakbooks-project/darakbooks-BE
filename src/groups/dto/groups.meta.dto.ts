import { ApiProperty } from '@nestjs/swagger';
import { GroupEntity } from '../entities/groups.entity';

export class GroupsMetaDto extends GroupEntity {
  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: 5 })
  totalGroups: number;

  @ApiProperty({ example: 2 })
  currentPage: number;
}
