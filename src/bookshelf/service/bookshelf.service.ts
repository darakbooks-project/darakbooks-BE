import { Inject, Injectable } from '@nestjs/common';
import { Bookshelf } from 'src/entities/BookShelf.entity';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { BookDTO } from '../book.dto';
import { UserService } from 'src/user/service/user.service';
import { CreateRecordDTO } from 'src/record/dto/create-record.dto';

@Injectable()
export class BookshelfService {
    constructor(
        @Inject('BOOK_REPOSITORY') private bookRepository:Repository<Book>, 
        @Inject('BOOKSHELF_REPOSITORY') private bookShelfRepository:Repository<Bookshelf>, 
        private userService:UserService,
    ){}

    async addBookToBookshelf(userId:string, createDTO:BookDTO){
        //책 있는지 확인 후 책 data 만들기 
        let book = await this.findOne(createDTO.bookIsbn);
        if(!book) book = await this.addBookToDB(createDTO);
        //안 읽은 책이면 책장에 추가하기 
        const user = await this.userService.addBook(userId,book);
        const bookshelf = new Bookshelf();
        bookshelf.user = user;
        bookshelf.book = book;
        await this.bookShelfRepository.save(bookshelf);

    }

    async findOne(id:string){
        const book = await this.bookRepository.findOneBy({bookIsbn:id});
        if(!book) return null;
        else return book;
    }

    async addBookToDB(createDTO:BookDTO){
        //책 없으면 책db에 추가 
        const book = this.bookRepository.create(createDTO);
        return await this.bookRepository.save(book);
    }

    async addBookToBookshelfByRecord(userId:string, createDTO:CreateRecordDTO){
        const { title, thumbnail, bookIsbn } = createDTO;
        const bookDTO = { title, thumbnail, bookIsbn } ;
        
        //책 있는지 확인 후 책 data 만들기 
        let book = await this.findOne(bookDTO.bookIsbn);
        if(!book) book = await this.addBookToDB(bookDTO);
        //안 읽은 책이면 책장에 추가하기 
        const user = await this.userService.addBook(userId,book);
        const bookshelf = new Bookshelf();
        bookshelf.user = user;
        bookshelf.book = book;
        await this.bookShelfRepository.save(bookshelf);

    }

    async getBookshelfByUserId(ownerId:string, userId:string){
        this.userService.getUserBooks(ownerId,userId) ;
    }

    //async getRecommendedBookshelf

}
