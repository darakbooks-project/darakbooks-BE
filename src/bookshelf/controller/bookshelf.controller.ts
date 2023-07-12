import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  UseFilters,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { BookshelfService } from '../service/bookshelf.service';
import { BookDTO } from '../book.dto';
import { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { unahtorizeddDTO, userNotfoundDTO } from 'src/dto/LoginResponse.dto';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfound.filter';
import {
  bookshelfForbiddenDTO,
  bookshelfNotfoundDTO,
  bookshelfResDTO,
  forbiddenDTO,
} from 'src/dto/bookshelfResponse.dto';
import { ForbiddenExceptionFilter } from 'src/exceptionFilter/forbidden.filter';

@Controller('bookshelf')
export class BookshelfController {
  constructor(private readonly bookshelfService: BookshelfService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '책장에 책 추가 | Add books to bookshelf' })
  @ApiBody({ type: BookDTO })
  @ApiResponse({ status: 204 })
  @ApiUnauthorizedResponse({
    status: 401,
    type: unahtorizeddDTO,
    description: 'token이 유효하지 않습니다. | Invalid token ',
  })
  @ApiNotFoundResponse({
    status: 404,
    type: userNotfoundDTO,
    description: '존재하지 않는 사용자 | Non-existing user',
  })
  @ApiForbiddenResponse({
    status: 403,
    type: forbiddenDTO,
    description: '이미 책장에 담겨 있는 책 | Book already exists',
  })
  @UseFilters(JwtExceptionFilter, ForbiddenExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @Post('')
  async addBook(
    @Body() bookDTO: BookDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { userId } = req.user as any;
    await this.bookshelfService.addBookToBookshelf(userId, bookDTO);
    res.status(204).send();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '특정 사용자 책장의 책 가져오기 | View book of specific user ',
  })
  @ApiParam({
    name: 'owenrId',
    type: 'string',
    description: '요청할 책장의 사용자 userId | userId of bookshelf',
  })
  @ApiResponse({ status: 200, type: [BookDTO] })
  @ApiUnauthorizedResponse({
    status: 401,
    type: unahtorizeddDTO,
    description: 'token이 유효하지 않습니다. | Invalid token ',
  })
  @ApiNotFoundResponse({
    status: 404,
    type: userNotfoundDTO,
    description: '존재하지 않는 사용자 | non-existing user ',
  })
  @UseFilters(JwtExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @Get(':ownerId')
  async getBookShelf(@Param('ownerId') ownerId: string, @Req() req: Request) {
    const { userId } = req.user as any;
    //특정 사용자의 책장
    if (ownerId) {
      return await this.bookshelfService.getBookshelfByUserId(ownerId, userId);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 자신의 책장의 책 가져오기 | Get my bookshelf ',
  })
  @ApiResponse({ status: 200, type: [BookDTO] })
  @ApiUnauthorizedResponse({
    status: 401,
    type: unahtorizeddDTO,
    description: 'token이 유효하지 않습니다. | Invalid token ',
  })
  @ApiNotFoundResponse({
    status: 404,
    type: userNotfoundDTO,
    description: '존재하지 않는 사용자 | Nonexisting user ',
  })
  @Get()
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  @UseGuards(JwtAuthGuard)
  async getMyBookshelf(@Req() req: Request) {
    const { userId } = req.user as JwtPayload;
    return await this.bookshelfService.getMyBookshelf(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '로그인한 사용자의 맞춤 책장 추천 | Recommend Bookshelf',
  })
  @ApiResponse({
    status: 200,
    type: bookshelfResDTO,
    description:
      '추천사용자의 배열과 추천사용자의 책장 속 책3권 배열(swagger에는 책1권 밖에 안나오지만 보이는 책data3개*3 배열)',
  })
  @UseFilters(JwtExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @Get('/main/recommend')
  async getRecommendedBookshelf(@Req() req: Request) {
    const { userId } = req.user as any;
    //특정 사용자의 책장
    return await this.bookshelfService.getRecommendedBookshelf(userId);
  }

  @ApiOperation({
    summary:
      '비로그인 사용자의 맞춤 책장 추천 | Recommend Bookshelf to non-logged in user',
  })
  @ApiResponse({
    status: 200,
    type: bookshelfResDTO,
    description:
      '추천사용자의 배열과 추천사용자의 책장 속 책3권 배열(swagger에는 책1권 밖에 안나오지만 보이는 책data3개*3 배열)',
  })
  @Get('/main/random')
  async getRandomBookshelf(@Req() req: Request) {
    //특정 사용자의 책장
    return await this.bookshelfService.getRandomBookshelf();
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204 })
  @ApiOperation({
    summary:
      '마이서재페이지에서 책장 속 책 삭제 | Delete book in bookshelf from my page',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    type: unahtorizeddDTO,
    description: 'token이 유효하지 않습니다. | Invalid token ',
  })
  @ApiForbiddenResponse({
    status: 403,
    type: bookshelfForbiddenDTO,
    description: '책장에 책을 삭제할 수 있는 권한이 없습니다. | You do not have the right to remove this book',
  })
  @ApiNotFoundResponse({
    status: 404,
    type: bookshelfNotfoundDTO,
    description: '책장이 존재하지 않습니다 | Non-existing bookshelf',
  })
  @UseFilters(JwtExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @Delete(':bookId')
  async remove(
    @Param('bookId') bookId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { userId } = req.user as JwtPayload;
    await this.bookshelfService.remove(userId, bookId);
    res.status(204).send();
  }
}
