import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Record } from 'src/record/record.entity';
import { Transform } from 'class-transformer';
import { UserGroup } from '../user-group/entities/user-group.entity';

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: '유저 id',
  })
  @PrimaryColumn({ name: 'user_id', type: 'bigint' })
  @Transform(({ value }) => String(value))
  userId: string;

  @ApiProperty({
    example: '민아',
    description: '카카오 닉네임',
  })
  @Column()
  nickname: string; //kakao nick name 받아오지만 수정 가능

  @ApiProperty({
    example: 'profile_img path',
    description: '프로필 사진',
  })
  @Column({ nullable: true, name: 'profile_img' })
  profileImg: string;

  @ApiProperty({
    example: 'user_info',
    description: '유저 정보(설명추가)',
  })
  @Column({ nullable: true, name: 'user_info' })
  userInfo: string;

  @ApiProperty({
    example: 'female',
    description: '성별',
  })
  @Column({ nullable: true })
  gender: string;

  @ApiProperty({
    example: '23',
    description: '나이',
  })
  @Column({ nullable: true })
  age: string;

  @ApiProperty({
    example: 'kakao',
    description: '(설명추가)',
  })
  @Column({ default: 'kakao' })
  provider: string;

  //redis에 refresh token 저장하는 걸로 바꾸고 나면 없애야 함.
  @Column({ nullable: true })
  refresh: boolean;

  @ApiProperty({
    example: 'True',
    description: '책장 (설명추가)',
  })
  @Column({ default: false, name: 'bookshelf_is_hidden' })
  bookshelfIsHidden: boolean;

  @ApiProperty({
    example: 'True',
    description: '그룹 (설명추가)',
  })
  @Column({ default: false, name: 'group_is_hidden' })
  groupIsHidden: boolean;

  @ApiProperty({
    example: 'True',
    description: '레코드 (설명추가)',
  })
  @Column({ default: false, name: 'records_is_hidden' })
  recordsIsHidden: boolean;

  @ApiProperty({
    example: '[x,x,x]',
    description: '레코드 (설명추가)',
  })
  @OneToMany(() => Record, (record) => record.userId)
  records: Record[];

  @ApiProperty({
    example: [2, 3, 4],
    description: 'user가 속한 그룹',
  })
  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroup: UserGroup[];
}
