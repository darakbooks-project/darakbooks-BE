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

    async validateUserRefresh(userId:string){
        const user = await this.findByuserId(userId);
        //if(!user) 
    }

    //refresh 는 redis 사용시 추후 수정해야 함. 
    async setRefresh(userId:string){
        return await this.userRepository.update(userId,{refresh:true});
    }

    async deleteRefresh(userId:string){
        return await this.userRepository.update(userId,{refresh:false});
    }

    
}
