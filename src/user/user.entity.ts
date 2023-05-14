import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn({ name:'user_id',})
    userId: number; // 확인 후 타입 수정 
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


}