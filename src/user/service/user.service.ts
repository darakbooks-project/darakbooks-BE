import { Injectable, Inject } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@Inject('USER_REPOSITORY') private userRepository:Repository<User>){}

    async findByuserId(id: string ):Promise<User | null> {
        return await this.userRepository.findOneBy({userId: id});
    }

    async createUser(userData):Promise<User> {
        return await this.userRepository.save(userData);
    }
    
}
