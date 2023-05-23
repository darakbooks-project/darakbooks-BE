import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { Transform } from 'class-transformer';
import { Record } from 'src/record/record.entity';
@Entity()
export class User{
    @PrimaryColumn({ name:'user_id',type: 'bigint' })
    @Transform(({ value }) => String(value))
    userId: string;
    @Column()
    nickname : string ; //kakao nick name 받아오지만 수정 가능 
    @Column({nullable:true, name:'profile_img', })
    profileImg:string;
    @Column({nullable:true, name:'user_info' })
    userInfo:string;
    @Column({nullable:true })
    gender:string;
    @Column({nullable:true })
    age:string;
    @Column({default:'kakao'})
    provider:string;
    //redis에 refresh token 저장하는 걸로 바꾸고 나면 없애야 함. 
    @Column({nullable:true})
    refresh:boolean;
    @Column({default:false, name:'bookshelf_is_hidden',})
    bookshelfIsHidden:boolean;
    @Column({default:false, name:'group_is_hidden',})
    groupIsHidden:boolean;
    @Column({default:false, name:'records_is_hidden',})
    recordsIsHidden:boolean;
    @OneToMany(() => Record, record => record.userId)
    records: Record[];
    
}