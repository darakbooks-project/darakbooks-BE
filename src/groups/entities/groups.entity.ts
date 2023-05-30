import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserGroup } from '../../user-group/entities/user-group.entity';

export enum MeetingType {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity({ name: 'groups' })
export class Groups {
  @ApiProperty({
    example: 1,
    description: '그룹 id',
  })
  @PrimaryGeneratedColumn()
  group_id: number;

  @ApiProperty({
    example: '책 읽는 행복한 모임',
    description: '모임 이름',
  })
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @Column()
  name: string;

  @ApiProperty({
    example: true,
    description: '모집중 true/false',
  })
  @Column({ type: 'boolean' })
  recruitment_status: boolean;

  @ApiProperty({
    example: 'online',
    description: '모임방식 online/offline',
  })
  @Column({ type: 'enum', enum: MeetingType, default: MeetingType.ONLINE })
  meeting_type: MeetingType;

  @ApiProperty({
    example: '서울 강서구',
    description: '모임 장소',
  })
  @Column()
  region: string;

  @ApiProperty({
    example: '자유롭게 책을 읽고 공유하는 모임 입니다.',
    description: '모임 설명',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: 20,
    description: '인원수 제한',
  })
  @Column()
  participant_limit: number;

  @ApiProperty({
    example: 'open.kakao......',
    description: '오픈채팅방 링크',
  })
  @Column()
  open_chat_link: string;

  @ApiProperty({
    example: 1,
    description: '그룹장',
  })
  @Column({ nullable: true })
  group_lead: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: '그룹에 속한 user 아이디',
  })
  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroup: UserGroup[];

  @CreateDateColumn({
    nullable: false,
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: true,
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  updated_at: Date;

  @DeleteDateColumn({
    nullable: true,
    type: 'datetime',
    precision: 0,
  })
  deleted_at: Date;
}
