import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/entities/book.entity';
import { UpdateUserDTO } from 'src/dto/updateUserDTO';
import { Bookshelf } from 'src/entities/BookShelf.entity';

@Injectable()
export class UserService {
    constructor(@Inject('USER_REPOSITORY') private userRepository:Repository<User>){}

    async findByuserId(id: string ):Promise<User | null> {
        return await this.userRepository.findOneBy({userId: id});
    }

    async create(userData):Promise<User> {
        const user = await this.userRepository.save(userData);
        user.bookshelves = [];
        return await this.userRepository.save(user);
    }
    
    async validateUser(id:string){
        const user = await this.userRepository.findOneBy({userId: id});
        if(!user) throw new NotFoundException('USER'); 
        return user;
    }

    async update(id:string, updateDTO: UpdateUserDTO){
        const user = await this.validateUser(id);
        //update method 
        user.update = updateDTO;
        return await this.userRepository.save(user);
    }

    async updateBookshelf(user:User,bookshelf:Bookshelf){
        //update method 
        if (!user.bookshelves) {
            user.bookshelves = [];
        }
        user.bookshelves.push(bookshelf);
        return await this.userRepository.save(user);
    }

    async canViewBookshelf(ownerId:string, userId:string){
        const user = await this.validateUser(ownerId);
        if(user.bookshelfIsHidden && userId!==ownerId) 
            throw new UnauthorizedException("Unahtorized: this is hideen booksehlf");
        return ;
    }
}
