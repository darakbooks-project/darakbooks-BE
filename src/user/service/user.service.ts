import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/entities/book.entity';
import { UpdateUserDTO } from 'src/dto/updateUserDTO';
import { Bookshelf } from 'src/entities/BookShelf.entity';
import { profileResDTO } from 'src/dto/profileResponse.dto';
import { min } from 'class-validator';

@Injectable()
export class UserService {
    constructor(@Inject('USER_REPOSITORY') private userRepository:Repository<User>){}

    async findByuserId(id: string ):Promise<User | null> {
        return await this.userRepository.findOneBy({userId: id});
    }

    async create(userData):Promise<User> {
        const user = await this.userRepository.save(userData);
        return await this.userRepository.save(user);
    }
    
    async validateUser(id:string){
        const user = await this.userRepository.findOneBy({userId: id});
        if(!user) throw new NotFoundException('USER'); 
        return user;
    }

    async getProfile(id:string){
        //1.존재하는 사용자인지 확인 
        //2. 자기 자신의 user profile 불러오기 
        const profile = await this.userRepository.findOne({ 
            where: { userId: id }, 
            select: ['userId', 'nickname', 'photoUrl', 'userInfo', 'bookshelfIsHidden'] 
        });
        return profile;
    }

    toDTO(profile,me:boolean):profileResDTO{
        const { userId, nickname, photoUrl, userInfo, bookshelfIsHidden } = profile;
        const dto: profileResDTO = { userId, nickname, photoUrl, userInfo, bookshelfIsHidden, isMine: me };
        return dto;
    }

    async update(id:string, updateDTO: UpdateUserDTO){
        const user = await this.validateUser(id);
        //update method 
        user.update = updateDTO;
        const profile = await this.userRepository.save(user);
        return this.toDTO(profile,true);
    }

    
    async canViewBookshelf(ownerId:string, userId:string){
        const user = await this.validateUser(ownerId);
        if(user.bookshelfIsHidden && userId!==ownerId) 
            throw new UnauthorizedException("Unahtorized: this is hideen booksehlf");
        return ;
    }
}
