import { Entity, PrimaryGeneratedColumn , Column } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    user_id: any; // 확인 후 타입 수정 
    @Column()
    nickname : string ; //kakao nick name 받아오지만 수정 가능 
    @Column({nullable:true })
    profile_img:string;
    @Column({nullable:true })
    user_info:string;
    @Column({nullable:true })
    gender:any;
    @Column({nullable:true })
    age:any;
    


}