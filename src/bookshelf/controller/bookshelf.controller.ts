import { Body, Controller, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfoud.filter';

@Controller('bookshelf')
export class BookshelfController {
    
    @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Post('/:bookId')
    async add(@Body() bookDTO:BookDto, @Req() req:Request){
        return this.bookshelfService.add();
    }

}
