import { Body, Controller, Get, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfoud.filter';
import { BookshelfService } from '../service/bookshelf.service';
import { Request } from 'express';
import { BookDTO } from '../book.dto';

@Controller('bookshelf')
export class BookshelfController {
    constructor(private readonly bookshelfService:BookshelfService){}

    @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async addBook(@Body() bookDTO:BookDTO, @Req() req:Request){
        const {userId} =  req.user as JwtPayload;
        return this.bookshelfService.addBookToBookshelf(userId,bookDTO);
    }

    @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getBookShelf( 
        @Query('ownerId') ownerId: string,
        @Req() req:Request
    ){
        const {userId} =  req.user as JwtPayload;
        //특정 사용자의 책장 
        if(userId){
            await this.bookshelfService.getBookshelfByUserId(ownerId,userId);
        }
        else{ //메인화면에서 사용할 책장 
            //await this.bookshelfService.getRecommendedBookshelf()
        }

    }

}
