import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Transform } from 'class-transformer';
import { Record } from 'src/record/record.entity';
import { Book } from 'src/entities/book.entity';
import { Bookshelf } from 'src/entities/BookShelf.entity';
import { UpdateUserDTO } from 'src/dto/updateUserDTO';
import { ApiProperty } from '@nestjs/swagger';
import { GroupEntity } from 'src/groups/entities/groups.entity';
@Entity()
export class User{
    @PrimaryColumn({ name:'user_id',type: 'bigint' })
    @Transform(({ value }) => String(value))
    userId: string;
    
    @ApiProperty({
        example: '민아',
        description: '카카오 닉네임',
      })
    @Column()
    nickname : string ; //kakao nick name 받아오지만 수정 가능 

    @ApiProperty({
        example: 'profile_img path',
        description: '프로필 사진',
      })
    @Column({nullable:true, name:'profile_img', })
    profileImg:string;

    @ApiProperty({
        example: 'user_info',
        description: '유저 정보(설명추가)',
    })
    @Column({nullable:true, name:'user_info' })
    userInfo:string;

    @ApiProperty({
        example: 'female',
        description: '성별',
    })    
    @Column({nullable:true })
    gender:string;

    @ApiProperty({
        example: '23',
        description: '나이',
    })
    @Column({nullable:true })
    age:string;

    @ApiProperty({
        example: 'kakao',
        description: 'provider로 로그인한 유저입니다.',
      })
    @Column({default:'kakao'})
    provider:string;

    @Column({default:false, name:'bookshelf_is_hidden',})
    bookshelfIsHidden:boolean;

    @Column({default:false, name:'group_is_hidden',})
    groupIsHidden:boolean;

    // @OneToMany(() => Record, record => record.userId)
    // records: Record[];
    
    @OneToMany(() => Bookshelf, bookshelf => bookshelf.user)
    bookshelves: Bookshelf[];
    
    set update(dto:UpdateUserDTO){
        Object.assign(this,dto);
    }

    @ApiProperty({
        example: [2, 3, 4],
        description: 'user가 속한 그룹',
    })
    @ManyToMany(() => GroupEntity, (group) => group.userGroup)
    @JoinTable()
    groups: GroupEntity[];
}