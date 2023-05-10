import { Entity, PrimaryGeneratedColumn , Column } from 'typeorm';
//camel case는 db에 올릴 때 쓰기 위해 name field 바꿈. 

@Entity()
export class UserEntity{
    @PrimaryGeneratedColumn({ name:'user_id',})
    userId: any; // 확인 후 타입 수정 
    @Column()
    nickname : string ; //kakao nick name 받아오지만 수정 가능 
    @Column({nullable:true, name:'profile_img', })
    profileImg:string;
    @Column({nullable:true, name:'user_info' })
    userInfo:string;
    @Column({nullable:true })
    gender:any;
    @Column({nullable:true })
    age:any;
    


}