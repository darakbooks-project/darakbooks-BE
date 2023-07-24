import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Bookshelf } from 'src/entities/BookShelf.entity';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { BookDTO } from '../book.dto';
import { UserService } from 'src/user/service/user.service';
import { PythonShell } from 'python-shell';
import { RecordService } from 'src/record/service/record.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookshelfService {
    private options;
    private minBookCount;
    private bookshelfLimit;
    constructor(
        @Inject('BOOK_REPOSITORY') private bookRepository:Repository<Book>, 
        @Inject('BOOKSHELF_REPOSITORY') private bookShelfRepository:Repository<Bookshelf>, 
        private userService:UserService,
        private recordService:RecordService,
        private configService:ConfigService,
    ){
        this.options = {
            pythonPath: configService.get('python.path'),
            scriptPath: 'src/scripts', // Python 스크립트 경로 (현재 디렉토리 기준)
            args: [] // Python 스크립트에 전달할 인자 (옵션)
        }
        this.minBookCount=3;
        this.bookshelfLimit=1;//py에도 넘기도록 수정 

    }

    async getRecommendedBookshelf(userId:string,){
        let result, user;
        const pyshell = new PythonShell('recommendations.py', this.options);
        const bookshelves = await this.bookShelfRepository
        .createQueryBuilder('bookshelf')
        .select('bookshelf.userId')
        .addSelect('bookshelf.bookIsbn',)
        .addSelect('COUNT(*)', 'bookCount')
        .groupBy('bookshelf.userId')
        .having('COUNT(*) >= :minBookCount', { minBookCount: this.minBookCount })
        .orderBy('RAND()')
        .getMany();
        console.log(bookshelves);
        const jsonBookshelfs = JSON.stringify(bookshelves);
        //console.log(bookshelves);
        pyshell.send(jsonBookshelfs);
        pyshell.send(userId);
        //userId 3개 나옴 
        const recommendedUser: string = await new Promise((resolve, reject) => {
            pyshell.on('message', (message) => {
                resolve(JSON.parse(message));
            });
            pyshell.end((err) => {
              if (err) {
                reject(err);
              }
            });
          });
        //console.log(recommendedUsers);
        if(recommendedUser.length>0) {
            // const promises = recommendedUsers.map((user) => this.getMyBookshelf(user,this.minBookCount));
            // result = await Promise.all(promises);
            result = await this.getMyBookshelf(recommendedUser,this.minBookCount);
            // const userPromises = recommendedUser.map((user) => this.userService.findByuserId(user));
            // users = await Promise.all(userPromises);
            // users = users.map(user=>{return {userId:user.userId,nickname:user.nickname};})
            user = await this.userService.findByuserId(recommendedUser);
            user = {userId:user.userId, nickname:user.nickname};
            return {users:user,bookshelves:result};
        }else{
            return await this.getRandomBookshelf();
        } 
        
    }

    async getRandomBookshelf(){
        let result, user ;
        const randomUsers = await this.bookShelfRepository
        .createQueryBuilder('bookshelf')
        .addSelect('COUNT(*)', 'bookCount')
        .groupBy('bookshelf.userId')
        .having('COUNT(*) >= :minBookCount', { minBookCount: this.minBookCount })
        .orderBy('RAND()')
        .limit(this.bookshelfLimit)
        .select('bookshelf.userId')
        .getOne();
        //const randomUserIds = randomUsers.map(item => item.userId);
        if(!randomUsers) return {users:null,bookshelves:null};
        
        if(randomUsers) {
            const randomUserId = randomUsers.userId;
            //const promises = randomUserIds.map((user) => this.getMyBookshelf(user,this.minBookCount));
            //result = await Promise.all(promises);
            result = await this.getMyBookshelf(randomUserId,this.minBookCount);
            //const userPromises = randomUserId.map((user) => this.userService.findByuserId(user));
            //users = await Promise.all(userPromises);
            //users = users.map(user=>{return {userId:user.userId,nickname:user.nickname};})
            user = await this.userService.findByuserId(randomUserId);
            user = {userId:user.userId, nickname:user.nickname};
        }
        
        return {users:user,bookshelves:result};
    }

    async remove(userId:string,bookId:string){
        //recordService
        const records = await this.recordService.getByLastIdAndUserIdAndBookId("mine",userId,bookId,undefined,undefined);
        if(records.records.length>=1) throw new ForbiddenException('책의 독서기록이 작성 돼 있기 때문에 삭제가 안됩니다.');
        await this.findBookshelf(userId,bookId );
        await this.bookShelfRepository.delete({ userId: userId, bookIsbn: bookId });
    }

    async findBookshelf(userId:string,bookId:string){
        const bookshelf = await this.bookShelfRepository.findBy({ userId: userId, bookIsbn: bookId });
        if(!bookshelf) throw new NotFoundException("사용자의 책장에 저장 돼 있지 않은 책입니다.");
    }
    
    async addBookToBookshelf(userId:string, createDTO:BookDTO, callbyRecord:boolean=false){
        //책 있는지 확인 후 책 data 만들기 
        const bookIsbn = await this.addBookToDB(createDTO);
        //user가 읽은책인지 확인
        const isread = await this.isReadBook(userId,bookIsbn) ;
        //읽은 책인데 책장에 추가한 경우 
        if(isread&&!callbyRecord) throw new ForbiddenException("이미 책장에 저장된 책입니다.");
        //독서기록으로 인해 자동 추가 되는 경우 
        if(isread&&callbyRecord) return;
        //user가 존재하는지 확인 
        const user = await this.userService.validateUser(userId);
        console.log(user);
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
        if(!await this.userService.canViewBookshelf(ownerId,userId)) return [];
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
    async getMyBookshelf(userId:string,bookLimit:number=0){
        let books;
        if(bookLimit===0) {
            books = await this.bookRepository.createQueryBuilder("book")
            .innerJoin("book.bookshelves", "bookshelf")
            .innerJoin("bookshelf.userId", "user", "user.userId = :userId", { userId: userId })
            .getMany();
        }
        else{
            books = await this.bookRepository.createQueryBuilder("book")
            .innerJoin("book.bookshelves", "bookshelf")
            .innerJoin("bookshelf.userId", "user", "user.userId = :userId", { userId: userId })            
            .limit(bookLimit)
            .getMany();
        }      
        return books;
    }

    
}
