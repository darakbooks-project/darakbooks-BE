import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Transform } from 'class-transformer';
import { Record } from 'src/record/record.entity';
import { Book } from 'src/entities/book.entity';
import { Bookshelf } from 'src/entities/BookShelf.entity';
import { UpdateUserDTO } from 'src/dto/updateUserDTO';
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
}