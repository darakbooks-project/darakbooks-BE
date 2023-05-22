import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MeetingType {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity({ name: 'groups' })
export class Groups {
  @PrimaryGeneratedColumn()
  group_id: number;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  recruitment_status: boolean;

  @Column({ type: 'enum', enum: MeetingType, default: MeetingType.ONLINE })
  meeting_type: MeetingType;

  @Column()
  region: string;

  @Column()
  description: string;

  @Column()
  participant_limit: number;

  @Column()
  open_chat_link: string;

  @Column({ nullable: true })
  representative_image: string;

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
