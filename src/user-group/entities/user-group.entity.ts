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
    example: [1, 2, 3],
    description: '유저가 속한 그룹의 id',
  })
  @ManyToOne(() => User, (user) => user.userGroup, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({
    example: [1, 2, 3],
    description: '그룹에 속한 유저의 id',
  })
  @ManyToOne(() => Groups, (group) => group.userGroup, { onDelete: 'CASCADE' })
  group: Groups;
}
