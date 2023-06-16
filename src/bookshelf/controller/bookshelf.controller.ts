import { Body, Controller, Get, Post, Query, Res, Req, UseFilters, UseGuards, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { BookshelfService } from '../service/bookshelf.service';
import { BookDTO } from '../book.dto';
import { Request , Response} from 'express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { unahtorizeddDTO, userNotfoundDTO } from 'src/dto/LoginResponse.dto';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfound.filter';

@Controller('bookshelf')
export class BookshelfController {
    constructor(private readonly bookshelfService:BookshelfService){}

    @ApiBearerAuth()
    @ApiOperation({summary: '책장에 책 추가'})
    @ApiBody({type:BookDTO})
    @ApiResponse({status:204,})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @UseFilters(JwtExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Post('')
    async addBook(@Body() bookDTO:BookDTO, @Req() req:Request, @Res() res: Response){
        const {userId} =  req.user as any;
        await this.bookshelfService.addBookToBookshelf(userId,bookDTO);
        res.status(204).send();
    }

    @ApiBearerAuth()
    @ApiOperation({summary: '특정 사용자 책장의 책 가져오기 '})
    @ApiParam({ name: 'owenrId', type: 'string' , description:'요청할 책장의 사용자 userId'})
    @ApiResponse({status:200, type:[BookDTO]})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @UseFilters(JwtExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Get(':ownerId')
    async getBookShelf( 
        @Param('ownerId') ownerId: string,
        @Req() req:Request
    ){
        console.log("here?");
        const {userId} =  req.user as any;
        //특정 사용자의 책장 
        if(ownerId){
            return await this.bookshelfService.getBookshelfByUserId(ownerId,userId);
        }
        

    }

    @ApiBearerAuth()
    @ApiOperation({summary: '사용자 자신의 책장의 책 가져오기 '})
    @ApiResponse({status:200, type:[BookDTO]})
    @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
    @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
    @Get()
    @UseFilters(JwtExceptionFilter,NotFoundExceptionFilter)
    @UseGuards(JwtAuthGuard)
    async getMyBookshelf(@Req() req: Request){
        const {userId} =  req.user as JwtPayload;
        return await this.bookshelfService.getMyBookshelf(userId);
    }

    @UseFilters(JwtExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Get('/main/recommend')
    async getRecommendedBookshelf( 
        @Req() req:Request
    ){
        const {userId} =  req.user as any;
        //특정 사용자의 책장 
        return await this.bookshelfService.getRecommendedBookshelf(userId);
    }


    @Get('/main/random')
    async getRandomBookshelf( 
        @Req() req:Request
    ){
        //특정 사용자의 책장 
        return await this.bookshelfService.getRandomBookshelf();
    }

    @UseFilters(JwtExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Delete(':bookId')
    async remove(
        @Param('bookId') bookId: string,
        @Req() req:Request,
        @Res() res: Response
    ) {
        const {userId} =  req.user as JwtPayload;
        await this.bookshelfService.remove(userId,bookId);
        res.status(204).send();
  }

}
