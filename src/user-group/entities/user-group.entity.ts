import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Groups } from '../../groups/entities/groups.entity';
import { User } from '../../user/user.entity';

@Entity({ name: 'user_group' })
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userGroup, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Groups, (group) => group.userGroup, { onDelete: 'CASCADE' })
  group: Groups;
}
