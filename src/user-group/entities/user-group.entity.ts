import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Groups } from '../../groups/entities/groups.entity';
import { User } from '../../user/user.entity';

@Entity({ name: 'user_group' })
export class UserGroup {
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '[group_id, group_id, group_id]',
    description: '유저가 속한 그룹의 id',
  })
  @ManyToOne(() => User, (user) => user.userGroup, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({
    example: '[user_id, user_id, user_id]',
    description: '그룹에 속한 유저의 id',
  })
  @ManyToOne(() => Groups, (group) => group.userGroup, { onDelete: 'CASCADE' })
  group: Groups;
}
