import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { GroupEntity } from '../../groups/entities/groups.entity';
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
    example: 'UserObject',
    description: '유저가 속한 그룹의 id',
  })
  @ManyToOne(() => User, (user) => user.groups, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({
    example: 'GroupObject',
    description: '그룹에 속한 유저의 id',
  })
  @ManyToOne(() => GroupEntity, (group) => group.userGroup, {
    onDelete: 'CASCADE',
  })
  group: GroupEntity;
}
