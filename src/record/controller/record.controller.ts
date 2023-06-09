import { Controller, Get, Post, Body, Patch, Param, Delete,Res, Query, UseGuards, UseFilters,Req, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { RecordService } from '../service/record.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { OwnerAuthGuard } from 'src/auth/owner/owner-auth.guard';
import JwtExceptionFilter from 'src/exceptionFilter/jwt.filter';
import { Request , Response} from 'express';
import { S3Service } from 'src/common/s3.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { photoDto } from '../dto/photo.dto';
import { Record } from '../record.entity';
import { CreateRecordDTO } from '../dto/create-record.dto';
import { BookshelfService } from 'src/bookshelf/service/bookshelf.service';
import { FileResDTO, FileUploadDto, internalErrorDTO, recordNotfoundDTO, unahtorizedRecordDTO } from 'src/dto/RecordResponseDTO';
import { unahtorizeddDTO, userNotfoundDTO } from 'src/dto/LoginResponseDTO';
import { create } from 'domain';
import { NotFoundExceptionFilter } from 'src/exceptionFilter/notfound.filter';
import { use } from 'passport';


@ApiTags('record')
@Controller('records')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly s3Service: S3Service,
    private readonly bookshelfService:BookshelfService,
    ) {}

  //jwt auth guard 추가 해야 함. 
  @ApiBearerAuth()
  @ApiOperation({summary: 'record 사진 등록'})
  @ApiResponse({status:201, type: photoDto})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type:FileUploadDto, description:'사진 파일'})
  @ApiResponse({type:FileResDTO, })
  @ApiInternalServerErrorResponse({type:internalErrorDTO,description:'file업로드 실패 '})
  @Post('/photo')
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  async uploadFile(@UploadedFile() file: Express.Multer.File){
    const result = await this.s3Service.uploadFile(file);
    return result;
  }

  @ApiBearerAuth()
  @ApiOperation({summary: '독서기록 등록'})
  @ApiBody({type:CreateRecordDTO})
  @ApiResponse({status:201, type: Record})
  @ApiUnauthorizedResponse({status:401, type:unahtorizeddDTO, description:'token이 유효하지 않습니다. '}) 
  @ApiNotFoundResponse({status:404, type:userNotfoundDTO,description:'존재하지 않는 사용자 '})
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  async create(@Body() createDTO: CreateRecordDTO,  @Req() req: Request) {
    const create_record_DTO = createDTO ;
    const {userId} =  req.user as JwtPayload;
    create_record_DTO.userId = userId;
    //const userId = "239487289347289";
    //create_record_DTO.userId = userId;
    const record = await this.recordService.create(create_record_DTO);
    //책db에 책 저장하기 
    await this.bookshelfService.addBookToBookshelfByRecord(userId,createDTO);
    return record ; //post return 할 때는 그냥 tag로 string으로만 보내는데 괜찮나? 
  }


  @ApiBearerAuth()
  @ApiOperation({summary: '독서기록 수정(수정하고 싶은 data만 전달하면 됨.)'})
  @ApiResponse({status:200, type:Record})
  @ApiBody({type:UpdateRecordDto})
  @ApiUnauthorizedResponse({status:401, type:unahtorizedRecordDTO, description:'record에 접근 권한이 없습니다.' })
  @ApiNotFoundResponse({status:404, type:recordNotfoundDTO, description:'존재하지 않는 독서기록 '})
  @UseGuards(JwtAuthGuard,OwnerAuthGuard)
  @Patch(':id')
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  async update(@Param('id') id: number, @Body() updateRecordDto: UpdateRecordDto) {
    return await this.recordService.update(+id, updateRecordDto);
  }

  @ApiOperation({summary: '전달한 BookIsbn와 일치하는 독서기록 요청'})
  @ApiResponse({status:200, type:[Record]})
  @ApiParam({ name: 'bookID', type: 'string' , description:'bookIsbn'})
  @ApiParam({ name: 'lastId', type: 'number' , description:'마지막으로 전달받은 recordId'})
  @ApiParam({ name: 'pageSize', type: 'number', description:'전달받고 싶은 record 수' })
  @Get()
  async getRecords(
    @Query('bookID') bookIsbn: string, 
    @Query('lastId') lastId: number, 
    @Query('pageSize') pageSize: number) {
    //도서상세 페이지 
    if (bookIsbn) {
      // bookID를 사용하여 작업 수행
      // 예: bookID를 이용해 데이터 조회 등
      const records = await this.recordService.getByLastIdAndBookId(lastId,pageSize,bookIsbn);
      return records;
    } else {
      // bookID가 없을 경우의 동작 처리 = main 페이지 
      const records = await this.recordService.getByLastId(lastId, pageSize);
      return records;
    }
  }

  //mypage 용 특정 사용자의 독서기록 전체보기 
  @ApiOperation({summary: '마이 서재페이지용 특정 사용자의 독서기록 전체보기'})
  @ApiResponse({status:200, type:[Record]})
  @ApiParam({ name: 'ownerId', type: 'string' , description:'서재의 owner 사용자 id'})
  @ApiParam({ name: 'lastId', type: 'number' , description:'마지막으로 전달받은 recordId'})
  @ApiParam({ name: 'pageSize', type: 'number', description:'전달받고 싶은 record 수' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRecordsByUserId(
    @Query('ownerId') ownerId: string, 
    @Query('lastId') lastId: number, 
    @Query('pageSize') pageSize: number,
    @Req() req: Request) {
    const {userId} =  req.user as JwtPayload;
    return await this.recordService.getByLastIdAndUserId(ownerId,userId,lastId,pageSize);
  }  



  @ApiBearerAuth()
  @ApiOperation({summary: '전달한 id와 일치하는 독서기록 요청'})
  @ApiResponse({status:200, type:Record})
  @ApiQuery({ name: 'id', type: 'string' , description:'요청하는 record의 recordId'})
  @ApiUnauthorizedResponse({status:401, type:unahtorizedRecordDTO, description:'record에 접근 권한이 없습니다.' })
  @ApiNotFoundResponse({status:404, type:recordNotfoundDTO, description:'존재하지 않는 독서기록 '})
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseFilters(JwtExceptionFilter, NotFoundExceptionFilter)
  async findOne(@Param('id') id: number) {
    return await this.recordService.findOne(+id);
  }


  @ApiBearerAuth()
  @ApiOperation({summary: '독서기록 삭제'})
  @ApiResponse({status:204})
  @ApiParam({ name: 'id', type: 'string' , description:'요청하는 record의 recordId'})
  @ApiUnauthorizedResponse({status:401, type:unahtorizedRecordDTO, description:'record에 접근 권한이 없습니다.' })
  @ApiNotFoundResponse({status:404, type:recordNotfoundDTO, description:'존재하지 않는 독서기록 '})
  @UseGuards(JwtAuthGuard,OwnerAuthGuard)
  @Delete(':id')
  @UseFilters(NotFoundExceptionFilter)
  async remove(@Param('id') id: number,@Res() res: Response) {
    await this.recordService.remove(+id);
    res.status(204).send();
  }
  
}

