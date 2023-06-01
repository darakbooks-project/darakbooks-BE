import { Body, Controller, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
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
    @Post('/:bookId')
    async add(@Body() bookDTO:BookDTO, @Req() req:Request){
        const {userId} =  req.user as JwtPayload;
        return this.bookshelfService.addBookToBookshelf(userId,bookDTO);
    }

}
