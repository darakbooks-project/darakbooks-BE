import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/entities/book.entity';

@Injectable()
export class UserService {
    constructor(@Inject('USER_REPOSITORY') private userRepository:Repository<User>){}

    async findByuserId(id: string ):Promise<User | null> {
        return await this.userRepository.findOneBy({userId: id});
    }

    async createUser(userData):Promise<User> {
        return await this.userRepository.save(userData);
    }
    
    async validateUser(userId){
        const user = await this.findByuserId(userId);
        if(!user) throw new NotFoundException('USER'); 
        return user;
    }

    async addBook(userId:string, book:Book){
        //user찾기 
        const user = await this.validateUser(userId);
        const isread = await this.isBookInUserReadBooks(user,book);
        if(!isread) user.books.push(book);
        return await this.userRepository.save(user);
    }
    async isBookInUserReadBooks(user:User, book:Book){
        //user가 읽은 책인지 확인하기 
        return user.books.find((b) => b.bookIsbn === book.bookIsbn);
    }
}
