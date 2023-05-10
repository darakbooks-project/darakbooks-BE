import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
export type User = any;

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) 
    private userRepostitory: Repository<UserEntity>){}

    //kakao userId 타입 보고 바꾸기 
    async findOne(userId: any ):Promise<UserEntity | void> {
        return this.userRepostitory.findOneBy({userId});
    }
}
