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
        const book = await this.addBookToDB(createDTO);
        //user가 읽은책인지 확인
        const isread = await this.isReadBook(userId,book.bookIsbn) ;
        if(isread) return;
        //user가 존재하는지 확인 
        const user = await this.userService.validateUser(userId);
        //안 읽은 책이라면 책장에 추가 
        await this.updateBookshelf(book,user);

    }

    //
    private async updateBookshelf(book: Book,user:User) {
        const bookshelf = new Bookshelf();
        bookshelf.user = user;
        bookshelf.book = book;
        await this.bookShelfRepository.save(bookshelf);
        //책<-책장, 유저<-책장 추가 
        await this.addUserToBook(book, bookshelf);
        await this.userService.updateBookshelf(user,bookshelf);
    }

    async addUserToBook(book: Book, bookshelf: Bookshelf) {
        book.bookshelves.push(bookshelf);
        this.bookRepository.save(book);
    }

    async findOne(id:string){
        const book = await this.bookRepository.findOneBy({bookIsbn:id});
        if(!book) return null;
        else return book;
    }

    async addBookToDB(createDTO:BookDTO){
        //책 없으면 책db에 추가 
        const isExist = await this.findOne(createDTO.bookIsbn);
        if(isExist) return isExist;
        const book = this.bookRepository.create(createDTO);
        return await this.bookRepository.save(book);
    }

    async addBookToBookshelfByRecord(userId:string, createDTO:CreateRecordDTO){
        //책 data 추출하기 
        const bookDTO = await this.createBookByRecord(createDTO);
        
        //책 있는지 확인 후 책 data 만들기 
        const book = await this.addBookToDB(bookDTO);
        console.log(book);

        //user가 읽은책인지 확인
        const isread = await this.isReadBook(userId,book.bookIsbn) ;
        if(isread) return;
        //user가 존재하는지 확인 
        const user = await this.userService.validateUser(userId);
        //안 읽은 책이라면 책장에 추가 
        await this.updateBookshelf(book,user);
    }

    private createBookByRecord(createDTO: CreateRecordDTO) {
        const { title, thumbnail, bookIsbn } = createDTO;
        const bookDTO = { title, thumbnail, bookIsbn };
        return bookDTO;
    }

    async getBookshelfByUserId(ownerId:string, userId:string){
        //user의 책장이 공개인지 아닌지 확인 
        await this.userService.canViewBookshelf(ownerId,userId);
        const books = await this.bookRepository.createQueryBuilder("book")
        .innerJoin("book.bookshelves", "bookshelf")
        .innerJoin("bookshelf.user", "user", "user.userId = :userId", { userId: ownerId })
        .getMany();
        return books;
    }

    async isReadBook(userId:string,bookIsbn:string){
        const book = await this.bookRepository.createQueryBuilder("book")
        .innerJoin("book.bookshelves", "bookshelf")
        .innerJoin("bookshelf.user", "user", "user.userId = :userId", { userId })
        .where("book.bookIsbn = :bookIsbn", { bookIsbn })
        .getOne();

        return book;
    }


    //async getRecommendedBookshelf

}
