import { Injectable, Inject } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@Inject('USER_REPOSITORY') private userRepository:Repository<User>){}

    async findByuserId(userId: number ):Promise<User | null> {
        return await this.userRepository.findOneBy({userId});
    }

    async createUser(userData):Promise<User> {
        return await this.userRepository.save(userData);
    }

    async validateUserRefresh(userId:number){
        const user = await this.findByuserId(userId);
        if(!user) 
    }
}
