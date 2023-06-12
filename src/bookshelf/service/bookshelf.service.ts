import { Inject, Injectable } from '@nestjs/common';
import { Bookshelf } from 'src/entities/BookShelf.entity';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { BookDTO } from '../book.dto';
import { UserService } from 'src/user/service/user.service';
import { CreateRecordDTO } from 'src/record/dto/create-record.dto';
import { User } from 'src/user/user.entity';
import { create } from 'domain';


@Injectable()
export class BookshelfService {
    constructor(
        @Inject('BOOK_REPOSITORY') private bookRepository:Repository<Book>, 
        @Inject('BOOKSHELF_REPOSITORY') private bookShelfRepository:Repository<Bookshelf>, 
        private userService:UserService,
    ){}

    async addBookToBookshelf(userId:string, createDTO:BookDTO){
        //책 있는지 확인 후 책 data 만들기 
        const bookIsbn = await this.addBookToDB(createDTO);
        //user가 읽은책인지 확인
        const isread = await this.isReadBook(userId,bookIsbn) ;
        console.log("isread",isread);
        if(isread) return;
        //user가 존재하는지 확인 
        const user = await this.userService.validateUser(userId);
        //안 읽은 책이라면 책장에 추가 
        await this.updateBookshelf(bookIsbn,userId);

    }
    
    private async updateBookshelf(book: string,user:string) {
        let bookshelf = await this.bookShelfRepository.create({bookIsbn:book,userId:user});
        bookshelf = await this.bookShelfRepository.save(bookshelf);
    }

    async findOne(id:string){
        const book = await this.bookRepository.findOneBy({bookIsbn:id});
        if(!book) return null;
        else return book;
    }

    async addBookToDB(createDTO:BookDTO){
        // 책이 이미 존재하는 경우에는 바로 반환
        const isExist = await this.findOne(createDTO.bookIsbn);
        if(isExist) return isExist.bookIsbn;
        const book = this.bookRepository.create(createDTO);
        return (await this.bookRepository.save(book)).bookIsbn;
    }

    async getBookshelfByUserId(ownerId:string, userId:string){
        //user의 책장이 공개인지 아닌지 확인 
        await this.userService.canViewBookshelf(ownerId,userId);
        const books = await this.bookRepository.createQueryBuilder("book")
        .innerJoin("book.bookshelves", "bookshelf")
        .innerJoin("bookshelf.userId", "user", "user.userId = :userId", { userId: ownerId })
        .getMany();
        console.log(books);
        return books;
    }

    async isReadBook(userId:string,bookIsbn:string){
        const book = await this.bookRepository.createQueryBuilder("book")
        .innerJoin("book.bookshelves", "bookshelf")
        .innerJoin("bookshelf.userId", "user", "user.userId = :userId", { userId })
        .where("book.bookIsbn = :bookIsbn", { bookIsbn })
        .getOne();

        return book;
    }


    //async getRecommendedBookshelf

}
