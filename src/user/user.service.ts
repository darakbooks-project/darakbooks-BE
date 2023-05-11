import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@Inject('USER_REPOSITORY') private userRepository:Repository<User>){}

    //kakao userId 타입 보고 바꾸기 
    async findByuserId(userId: number ):Promise<User | void> {
        console.log(userId);
        return await this.userRepository.findOneBy({userId});
    }

    async createUser(userData){
        const newUser = await this.userRepository.create(userData)
        console.log(newUser);
        return newUser;
    }
}
